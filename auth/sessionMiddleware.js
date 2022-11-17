const GenericResponse = require('../common/response')

const authenticatedSessionMiddleware = (req, res, next) => {
    if(req.session.isAuthenticated){
        next();
        return;
    }

    res.send(GenericResponse.failed({code: 'NOT_AUTHENTICATED'}));
}

module.exports= {
    authenticatedSessionMiddleware
}