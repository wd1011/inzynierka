const ErrorHandler = require('../utils/errorHandler');

const handleCastErrorDB = (err) => {
    const message = `Niepoprawny ${err.path}: ${err.value}.`;
    return new ErrorHandler(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    //console.log(value);
    return new ErrorHandler(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Niepoprawne dane. ${errors.join('. ')}`;
    return new ErrorHandler(message, 400);
};
const handleJWTError = () =>
    new ErrorHandler('Nie poprawny token, zaloguj sie ponownie!', 401);

const handleJWTExpiredError = () =>
    new ErrorHandler('Twoj token wygasl,zaloguj sie ponownie', 401);

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    //console.error('ERROR ', err);
    return res.status(err.statusCode).render('error.pug', {
        title: 'Sprobuj ponownie później!',
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        //console.error('ERROR', err);
        return res.status(500).json({
            status: 'error',
            message: 'Coś poszlo nie tak!!',
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).render('error.pug', {
            title: 'Coś poszlo nie tak!!',
            msg: err.message,
        });
    }
    //console.error('ERROR', err);
    return res.status(err.statusCode).render('error.pug', {
        title: 'Coś poszlo nie tak!!',
        msg: 'Sprobuj ponownie pozniej.',
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err };
        error.message = err.message;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};