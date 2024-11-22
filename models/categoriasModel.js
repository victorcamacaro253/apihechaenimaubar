import { query } from "../db/db1.js";

const categoriasModel ={


 async getCategories(){
 
    const SQL="SELECT * FROM categorias ";

    const result = query(SQL);
    return result;

 }

 
}


export default categoriasModel;