/**
 * Objeto con métodos para enviar respuestas HTTP.
 */
const httpHelpers = {
    /**
     * Envía una respuesta JSON exitosa con un mensaje.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} msg - El mensaje a enviar en la respuesta.
     * @returns {Object} - El objeto de respuesta JSON.
     */
    successResponse: (res, msg) => {
      const data = {
        status: 1,
        message: msg
      };
      return res.status(200).json(data);
    },
  
    /**
     * Envía una respuesta JSON exitosa con un mensaje y datos adicionales.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} msg - El mensaje a enviar en la respuesta.
     * @param {Object} data - Los datos adicionales a incluir en la respuesta.
     * @returns {Object} - El objeto de respuesta JSON.
     */
    successResponseWithData: (res, msg, data) => {
      const resData = {
        status: 1,
        message: msg,
        data: data
      };
      return res.status(200).json(resData);
    },
  
    /**
     * Envía una respuesta de error interno del servidor.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} msg - El mensaje de error a enviar en la respuesta.
     * @returns {Object} - El objeto de respuesta JSON.
     */
    errorResponse: (res, msg) => {
      const data = {
        status: 0,
        message: msg,
      };
      return res.status(500).json(data);
    },
  
    /**
     * Envía una respuesta indicando que el recurso no fue encontrado.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} msg - El mensaje de error a enviar en la respuesta.
     * @returns {Object} - El objeto de respuesta JSON.
     */
    notFoundResponse: (res, msg) => {
      const data = {
        status: 0,
        message: msg,
      };
      return res.status(404).json(data);
    },
  
    /**
     * Envía una respuesta de error de validación con datos adicionales.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} msg - El mensaje de error a enviar en la respuesta.
     * @param {Object} data - Los datos adicionales a incluir en la respuesta.
     * @returns {Object} - El objeto de respuesta JSON.
     */
    validationErrorWithData: (res, msg, data) => {
      const resData = {
        status: 0,
        message: msg,
        data: data
      };
      return res.status(400).json(resData);
    },
  
    /**
     * Envía una respuesta indicando que la solicitud no está autorizada.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} msg - El mensaje de error a enviar en la respuesta.
     * @returns {Object} - El objeto de respuesta JSON.
     */
    unauthorizedResponse: (res, msg) => {
      const data = {
        status: 0,
        message: msg,
      };
      return res.status(401).json(data);
    }
  };
  
  export default httpHelpers;
  