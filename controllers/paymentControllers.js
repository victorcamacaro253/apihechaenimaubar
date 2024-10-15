import Stripe from 'stripe'
import mercadoPago from 'mercadopago'
import comprasModel from '../models/comprasModel.js'
import { query } from '../db/db1.js'
import paypal from '@paypal/checkout-server-sdk';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/*
mercadoPago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  });*/
  
  const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET); 
const paypalClient = new paypal.core.PayPalHttpClient(environment);


class paymentControllers{

static paymentStripe= async (req,res)=>{
    const {items,user_id } = req.body
  
    try{
        const line_items= items.map(item=>({
            price_data:{
                product_data:{
                    name:item.name,
                    description : item.description
                },
                unit_amount: item.amount * 100,
                currency:'usd'
            },
            quantity: item.quantity
        }))


        const session= await  stripe.checkout.sessions.create({
            line_items,
            mode:'payment',
            success_url:'http://localhost:3000/success',
            cancel_url:'http://localhost:3000/cancel',

        })

            console.log(session)


         const result = await comprasModel.addCompra(user_id)

         const  idCompra = result.insertId


        // Insertar cada producto comprado en la tabla `productos_compras`
        for (const item of items) {
            const { product_id, amount, quantity } = item;

            await query(
                `INSERT INTO productos_compras (id_compra, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)`,
                [idCompra, product_id, quantity, amount]
            );
        }



         return res.json(({url:session.url}))



    }catch(error){
        return res.status(500).json({ message: error.message });
    }

}


static paymentMercadopago= async (req,res)=>{
        const  {items} = req.body

        try{
            //Mapeamos los items para crear el formato necesario para Mercado Pago 

            const preference = {
                items:items.map(item=>({
                    title:item.name,
                    unit_price: item.amount,
                    quantity:item.quantity,
                    description:item.description,
                    currency_id:'USD'
                })),
                backs_urls:{
                    success: 'http://localhost:3000/success',
                    failure: 'http://localhost:3000/failure',
                    pending: 'http://localhost:3000/pending',
                },
                auto_return:'approved',
            }

            const response = await mercadoPago.preferences.create(preference)

            //Devolvemos  la URL para que el cliente complete el pago 

            return res.json({url:response.body.init_point})
        } catch(error){
            return res.status(500).json({ message: error.message });
        }
}


//----------------------------------------------------

static createPaymentPaypal= async (req,res)=>{
    const {items}=req.body
    
    try {

        const orderRequest= new paypal.orders.OrdersCreateRequest();
        orderRequest.requestBody({
            intent:'CAPTURE',
            purchase_units:[
                {
                    amount:{
                        currency_code:'USD',
                        value: items.reduce((total,item)=> total + (item.amount * item.quantity)/100,0).toFixed(2),
                        breakdown:{
                            item_total:{
                                currency_code:'USD',
                                value: items.reduce((total,item)=> total + (item.amount * item.quantity)/100,0).toFixed(2),
                            }
                        }
                    },
                    items:items.map(item=>({
                        name: item.name,
                        description:item.description,
                        unit_amount:{
                            currency_code:'USD',
                            value:(item.amount/100).toFixed(2)
                        },
                        quantity: item.quantity,
                    }))
                }
            ],
            
            application_context:{
                return_url: `http://localhost:3000/paypal/capturePaymentPaypal`,
                cancel_url: 'http://localhost:3000/cancel',
            },
        })


    // Crear el pedido en PayPal
    const order = await paypalClient.execute(orderRequest);

    const returnUrl = `http://localhost:3000/paypal/capturePaymentPaypal?orderId=${order.result.id}`;


    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;


    // Enviar la respuesta con el ID del pedido
    res.status(200).json({ id: order.result.id,approvalUrl,returnUrl });
    
    } catch (error) {
        console.error(error); // Log para depurar
        res.status(400).json({ error: error.message });
    
    }
}


static capturePaymentPaypal = async (req, res) => {
    const { orderId } = req.query;  // orderId que obtuviste después de que el cliente aprobó la orden en PayPal

    try {
        // Crear una solicitud para capturar la orden
        const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);

        // Ejecutar la captura del pago
        const capture = await client.execute(captureRequest);

        // Revisar el estado de la captura
        if (capture.result.status === 'COMPLETED') {
            res.status(200).json({
                status: 'success',
                message: 'Payment captured successfully',
                details: capture.result // Detalles del pago capturado
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Payment capture failed',
                details: capture.result // Detalles del error
            });
        }
    } catch (error) {
        console.error('Error capturing payment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while capturing the payment',
            error: error.message
        });
    }
};

}


export default paymentControllers
