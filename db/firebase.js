import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
//import express, { json } from 'express';

const serviceAccount = JSON.parse(readFileSync('db/victor-501be-firebase-adminsdk-chk59-10b962ab03.json', 'utf-8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
/*
const getAllProducts = async () => {
  try {
    const productsSnapshot = await db.collection('productos').get();

    if (productsSnapshot.empty) {
      console.log('No se encontraron productos.');
      return [];
    }

    const products = [];
    for (const doc of productsSnapshot.docs) {
      const productData = doc.data();

      // Obtener el nombre de la categoría
      let categoriaNombre = 'Categoría no encontrada';
      if (productData.categoria) {
        const categoriaSnapshot = await productData.categoria.get();
        if (categoriaSnapshot.exists) {
          categoriaNombre = categoriaSnapshot.data().categoria; // Solo obtener el campo 'nombre'
        }
      }

      // Obtener datos del proveedor
      let proveedorData = 'Proveedor no encontrado';
      if (productData.proveedor) {
        const proveedorSnapshot = await productData.proveedor.get();
        if (proveedorSnapshot.exists) {
          proveedorData = proveedorSnapshot.data();
        }
      }

      products.push({
        id: doc.id,
        ...productData,
        proveedor: proveedorData, // Agrega los datos del proveedor
        categoria: categoriaNombre, // Agrega solo el nombre de la categoría
      });
    }

    console.log(products);
    return products;
  } catch (error) {
    return { error: `Error getting documents: ${error.message}` };
  }
};

// Function to get a user by ID
async function getUserById(userId) {
  try {
    const userRef = db.collection('productos').doc(userId);
    const doc = await userRef.get();
    console.log(doc)
    if (!doc.exists) {
      return { error: 'No such document!' };
    } else {
      return doc.data();
    }
  } catch (error) {
    return { error: `Error getting document: ${error.message}` };
  }
}
// Endpoint to get all products
app.get('/products', async (req, res) => {
  const productData = await getAllProducts();

  if (productData.error) {
    res.status(500).json(productData); // Cambiado a 500 porque es un error del servidor
  } else {
    res.status(200).json(productData);
  }
});


const userId = 'IYkdIfajvx7Q12Wzsnuo';
getUserById(userId);
getAllProducts();
const PORT = process.env.PORT ?? 3006;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

export default db;
