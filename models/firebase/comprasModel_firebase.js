import db from '../../db/firebase.js';


const comprasModel = {
    async  getAllCompras() {
        const dbRef = db.collection('compras');
        const querySnapshot = await dbRef.get();
      
        const compras = await Promise.all(querySnapshot.docs.map(async compraDoc => {
          const dataCompra = compraDoc.data();
      
          // Obtener la referencia al usuario
          const usuarioRef = dataCompra.id_usuario;
          
          // Traer los datos del usuario referenciado
          const usuarioSnapshot = await usuarioRef.get();
          let usuarioData = usuarioSnapshot.data();
      
          // Excluir el campo contraseña de los datos del usuario
          if (usuarioData && usuarioData.contraseña) {
            delete usuarioData.contraseña;
          }
      
          // Obtener la subcolección productos_comprados de esta compra
          const productosRef = compraDoc.ref.collection('productos_comprados');
          const productosSnapshot = await productosRef.get();
          const productosComprados = productosSnapshot.docs.map(productoDoc => productoDoc.data());
      
          // Devolver los datos de la compra junto con los productos comprados y los datos del usuario
          return {
            id_usuario: usuarioRef.path, // Mantén la referencia al usuario
            productos_comprados: productosComprados, // Productos comprados
            usuario: usuarioData // Datos del usuario sin contraseña
          };
        }));
      
        return compras;
      },
      
      async getComprasByUsuario(id_usuario) {
        try {
          // Convertimos el id de usuario en una referencia a un documento en la colección "usuarios"
          const userRef = db.collection('usuarios').doc(id_usuario);
          
          // Buscamos las compras donde el campo id_usuario sea igual a la referencia de usuario
          const snapshot = await db.collection('compras').where('id_usuario', '==', userRef).get();
      
          // Si no hay compras para este usuario, devuelve un array vacío
          if (snapshot.empty) {
            console.log(`No se encontraron compras para el usuario con id ${id}`);
            return [];
          }
      
          // Procesar cada compra
          const compras = await Promise.all(snapshot.docs.map(async (compraDoc) => {
            try {
              const dataCompra = compraDoc.data();
      
              // Obtener la referencia al usuario
              const usuarioRef = dataCompra.id_usuario;
      
              // Traer los datos del usuario referenciado
              const usuarioSnapshot = await usuarioRef.get();
              let usuarioData = usuarioSnapshot.data();
      
              // Excluir el campo contraseña de los datos del usuario si existe
              if (usuarioData && usuarioData.contraseña) {
                delete usuarioData.contraseña;
              }
      
              // Obtener la subcolección productos_comprados de esta compra
              const productosRef = compraDoc.ref.collection('productos_comprados');
              const productosSnapshot = await productosRef.get();
      
              // Mapear los productos comprados
              const productosComprados = productosSnapshot.docs.map((productoDoc) => productoDoc.data());
              const fecha = dataCompra.fecha.toDate();              // Devolver los datos de la compra junto con los productos comprados y los datos del usuario
              return {
                id_compra: compraDoc.id, // ID de la compra
                productos_comprados: productosComprados, // Lista de productos comprados
                usuario: usuarioData, // Datos del usuario (sin la contraseña)
                id_usuario: usuarioRef.id,
                fecha : fecha.toLocaleString()

              };
            } catch (error) {
              console.error(`Error procesando la compra con ID ${compraDoc.id}:`, error);
              return null;
            }
          }));
      
          // Filtrar cualquier compra que sea null debido a un error
          return compras.filter(compra => compra !== null);
        } catch (error) {
          console.error(`Error obteniendo compras para el usuario con id ${id}:`, error);
          throw new Error(`Error obteniendo compras para el usuario con id ${id}`);
        }
      },
      

      async getComprasByUsuarioId(id) {
        try {
          // Convertimos el id de usuario en una referencia a un documento en la colección "usuarios"
          const userRef = db.collection('usuarios').doc(id);
          
          // Buscamos las compras donde el campo id_usuario sea igual a la referencia de usuario
          const snapshot = await db.collection('compras').where('id_usuario', '==', userRef).get();
      
          if (snapshot.empty) {
            console.log('No se encontraron compras para el usuario:', id);
            return [];
          }
      
          // Iteramos sobre las compras y obtenemos los datos del usuario para cada una
          const compras = await Promise.all(snapshot.docs.map(async (doc) => {
            const compraData = doc.data();
            
            // Resolver referencia de usuario
            const usuarioSnapshot = await compraData.id_usuario.get();
            const usuarioData = usuarioSnapshot.data();
      
            // Retornamos los datos de la compra junto con los datos del usuario
            return {
              id: doc.id,
              ...compraData,
              id_usuario: usuarioData  // Reemplazamos la referencia por los datos del usuario
            };
          }));
      
          return compras;
        } catch (error) {
          console.error(`Error al obtener las compras para el usuario ${id}:`, error);
          throw new Error(`Error al obtener las compras para el usuario ${id}`);
        }
      },





      async deleteCompra(id_compra) {
        try {
          const compraRef = db.collection('compras').doc(id_compra);
          const snapshot = await compraRef.get();
      
          if (!snapshot.exists) {
            console.log(`No se encontró la compra con id ${id_compra}`);
            return;
          }
      
          const data = snapshot.data();
          const { id_usuario } = data;
      
          // Eliminar los productos comprados asociados a la compra
          const productosCompradosRef = compraRef.collection('productos_comprados');
          await productosCompradosRef.get().then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => doc.ref.delete());
          });
      
          // Eliminar la compra
          await compraRef.delete();
      
          console.log(`Compra con id ${id_compra} eliminada correctamente`);
        } catch (error) {
          console.error(`Error eliminando la compra con id ${id_compra}:`, error);
          throw new Error(`Error eliminando la compra con id ${id_compra}`);
        }
      },


      async getComprasCountByUsuario() {
        try {
          const comprasRef = db.collection('compras');
          const snapshot = await comprasRef.get();
    
          if (snapshot.empty) {
            console.log('No se encontraron compras');
            return [];
          }
    
          // Crear un objeto para almacenar el conteo de compras por usuario
          const comprasCount = {};
    
          // Recorrer las compras y contar cuántas tiene cada usuario
          snapshot.forEach(compraDoc => {
            const compraData = compraDoc.data();
            const usuarioRef = compraData.id_usuario; // Esto es una referencia
    
            // Asegurarse de que la referencia existe antes de usarla
            if (usuarioRef && usuarioRef.id) {
              const usuarioId = usuarioRef.id; // Acceder al ID del documento de usuario
    
              // Si este usuario no tiene compras contadas aún, inicializamos a 0
              if (!comprasCount[usuarioId]) {
                comprasCount[usuarioId] = 0;
              }
    
              // Incrementar el conteo de compras para este usuario
              comprasCount[usuarioId] += 1;
            } else {
              console.log(`La compra con id ${compraDoc.id} no tiene un usuario asociado`);
            }
          });
    
          // Convertir el objeto de conteo en un array de resultados
          const usuarioDataPromises = Object.keys(comprasCount).map(async usuarioId => {
            // Obtener los datos del usuario a partir de la referencia 
            const usuarioSnapshot = await db.collection('usuarios').doc(usuarioId).get()
            if(usuarioSnapshot.exists){
              const usuarioData= usuarioSnapshot.data()
            return {
              id_usuario: usuarioId,
              nombre: usuarioData.nombre,
              apellido:usuarioData.apellido,
              cantidad_compras: comprasCount[usuarioId]
            };
          }else{
            console.log(`Usuario con id ${usuarioId} no encontrado`);
            return null; // Si el usuario no existe, retorna null para este caso
  
            }
          });
          
          const  result = await Promise.all(usuarioDataPromises);


          return result;
    
        } catch (error) {
          console.error('Error al obtener el conteo de compras', error);
          throw new Error('Error al obtener el conteo de compras', error);
        }
      }
      
}

export default comprasModel