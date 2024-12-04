import csrf from 'csurf';

const csrfProtection = csrf({cookie: true})

const setCsrfToken = (req,res,next)=>{
    csrfProtection(req,res,()=>{
        res.cookie('XSRF-TOKEN',req.csrfToken())
        res.json({csrfToken: req.csrfToken()});
    })
}


const csrfMiddleware = (req,res,next)=>{
    csrfProtection(req,res,next)
}

export default {setCsrfToken,csrfMiddleware}