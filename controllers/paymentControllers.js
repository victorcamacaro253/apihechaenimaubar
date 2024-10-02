import Stripe from 'stripe'
import mercadoPago from 'mercadopago'
import comprasModel from '../models/comprasModel.js'
import { query } from '../db/db1.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/*
mercadoPago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  });*/
  
  

const paymentStripe= async (req,res)=>{
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


const paymentMercadopago= async (req,res)=>{
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


export default { paymentStripe,paymentMercadopago }
