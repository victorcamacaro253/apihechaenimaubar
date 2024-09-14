import db from '../../db/firebase.js';

const ProductModel=  {
    
     

        async getAllProducts() {
            try {
              const productsSnapshot = await db.collection('productos').get();
              const products = [];
        
              // Obtener todas las referencias de categoría y proveedor
              const categoryPromises = [];
              const providerPromises = [];
        
              productsSnapshot.docs.forEach(productDoc => {
                const productData = productDoc.data();
                if (productData.categoria) {
                  categoryPromises.push(productData.categoria.get());
                }
                if (productData.proveedor) {
                  providerPromises.push(productData.proveedor.get());
                }
              });
        
              // Esperar a que todas las promesas de categoría y proveedor se resuelvan
              const [categoryDocs, providerDocs] = await Promise.all([
                Promise.all(categoryPromises),
                Promise.all(providerPromises)
              ]);
        
              // Crear mapas para facilitar la búsqueda de datos de categoría y proveedor
              const categoryMap = new Map(categoryDocs.map(doc => [doc.id, doc.data()]));
              const providerMap = new Map(providerDocs.map(doc => [doc.id, doc.data()]));
        
              // Mapear productos con datos de categoría y proveedor
              productsSnapshot.docs.forEach(productDoc => {
                const productData = productDoc.data();
                products.push({
                  id: productDoc.id,
                  ...productData,
                  categoria: productData.categoria ? { id: productData.categoria.id, ...categoryMap.get(productData.categoria.id) } : null,
                  proveedor: productData.proveedor ? { id: productData.proveedor.id, ...providerMap.get(productData.proveedor.id) } : null,
                });
              });
        
              return products;
            } catch (error) {
              console.error('Error al obtener productos con categorías y proveedores:', error);
              throw new Error('Error al obtener productos');
            }
          },

          async getProductById(id) {
            try {
              // Obtener el documento del producto
              const productDoc = await db.collection('productos').doc(id).get();
              
              if (!productDoc.exists) {
                throw new Error('Producto no encontrado');
              }
        
              const productData = productDoc.data();
        
              // Si las referencias a categoría y proveedor existen, obtenemos sus datos
              const categoryPromise = productData.categoria ? productData.categoria.get() : Promise.resolve(null);
              const providerPromise = productData.proveedor ? productData.proveedor.get() : Promise.resolve(null);
        
              // Esperar a que ambas promesas se resuelvan
              const [categoryDoc, providerDoc] = await Promise.all([categoryPromise, providerPromise]);
        
              // Preparar la respuesta con datos de la categoría y proveedor
              const product = {
                id: productDoc.id,
                ...productData,
                categoria: categoryDoc ? { id: categoryDoc.id, ...categoryDoc.data() } : null,
                proveedor: providerDoc ? { id: providerDoc.id, ...providerDoc.data() } : null,
              };
        
              return product;
            } catch (error) {
              console.error('Error al obtener producto con categoría y proveedor:', error);
              throw new Error('Error al obtener producto');
            }
          },

         // Método para eliminar un producto por ID
  async deleteProduct(id) {
    try {
      // Referencia al documento del producto en Firestore
      const productRef = db.collection('productos').doc(id);

      // Eliminar el documento del producto
      await productRef.delete();

      // Devolver un mensaje de éxito
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  },

 
    // Método para buscar productos por nombre
  async searchProductByName(nombre_producto) {
    try {
      // Consultar los productos por nombre en Firestore
      const snapshot = await db.collection('productos')
        .where('nombre_producto', '==', nombre_producto)
        .get();

      if (snapshot.empty) {
        // Si no se encontraron productos, devolver un array vacío
        return [];
      }

      // Mapeamos los productos y realizamos consultas adicionales para las categorías y proveedores
      const products = await Promise.all(snapshot.docs.map(async doc => {
        const productData = doc.data();
        let categoriaData = null;
        let proveedorData = null;

        // Obtener los detalles de la categoría si existe
        if (productData.categoria) {
          const categoriaRef = productData.categoria;
          const categoriaSnapshot = await categoriaRef.get();
          if (categoriaSnapshot.exists) {
            categoriaData = categoriaSnapshot.data();
          }
        }

        // Obtener los detalles del proveedor si existe
        if (productData.proveedor) {
          const proveedorRef = productData.proveedor;
          const proveedorSnapshot = await proveedorRef.get();
          if (proveedorSnapshot.exists) {
            proveedorData = proveedorSnapshot.data();
          }
        }

        // Retornar el producto junto con los detalles completos de categoría y proveedor
        return {
          id: doc.id,
          ...productData,
          categoria: categoriaData || null,
          proveedor: proveedorData || null,
        };
      }));

      return products;
    } catch (error) {
      console.error('Error al buscar productos por nombre:', error);
      throw new Error('Error al buscar productos');
    }
  },
}

    
      export default ProductModel;
      


