const { EErrors } = require('../../services/errors/enums')

exports.handleError = (err, req, res, next) => {
    console.log(err)
    switch (err.code){
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).send({status: 'error', error: err.message})
            break;

        case EErrors.CART_OPERATION_ERROR:
            return res.status(400).send({status: 'error', error: err.message})
            break;

        default:
            return res.status(500).send({status: 'error', error: 'server error'})
            break;
    }
}