// middlewares/errorHandler.js
const handleError = (res, error, message = 'Error interno del servidor') => {
    console.error(error);
    res.status(500).json({ error: message });
};

export default handleError;