

class webhookController{
    
   static webhookCompra = async (req, res) => {
    const {id_compra,id_usuario,totalCompra,productos}= req.body
     try {
     // Procesar la información recibida
     console.log(`Notificación de compra recibida: ${id_compra}, Usuario: ${id_usuario}, Total: ${totalCompra}`);
     console.log('Productos:', productos);
 
     // Aquí puedes realizar más acciones, como enviar un correo, actualizar un sistema externo, etc.
 
     res.status(200).send('Webhook recibido correctamente');
 
 
     }catch(error){
       console.error('Error en el webhook de compra');
       res.status(500).json({error:'Error interno del servidor'})
     }
   }
}

export default  webhookController;
