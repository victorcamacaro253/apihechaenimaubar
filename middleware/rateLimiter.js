import rateLimit  from "express-rate-limit";
 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,// 15 minutos
    max:100,
    message: 'Demasiadas solicitudes desde esta IP,por favor intente de nuevo mas tarde',
    headers:true,
});

export default limiter;