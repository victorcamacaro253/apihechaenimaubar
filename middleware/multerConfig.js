import multer from "multer";
import path  from "path";


//configuracion del almacenamiento

const storage= multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})


//Inicializar multer
const upload= multer({storage});

export default upload;