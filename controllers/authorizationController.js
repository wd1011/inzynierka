const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const sendMail = require('../utils/emailHandler');

const token = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
};
const createToken = (user, statusCode, req, res) => {
    const tok = token(user._id);

    res.cookie('jwt', tok, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    res.cookie('userEmail', user.email, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),

        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        tok,
        data: {
            user,
        },
    });
};
exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
    });
    createToken(newUser, 201, req, res);
});
exports.signin = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Potwierdz adres email i haslo!', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('Niepoprawny adres  email lub haslo', 401));
    }
    createToken(user, 200, req, res);
});
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};
exports.security = catchAsync(async(req, res, next) => {
    let tok;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        tok = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        tok = req.cookies.jwt;
    }

    if (!tok) {
        return next(
            new ErrorHandler(
                'Nie jestes zalogowany, zaloguj sie aby miec dostęp.',
                401
            )
        );
    }
    const decoded = await promisify(jwt.verify)(tok, process.env.JWT_SECRET);

    const current = await User.findById(decoded.id);
    if (!current) {
        return next(new ErrorHandler('Ten uzytkownik juz nie istnieje.', 401));
    }
    if (current.timePasswordChanged(decoded.iat)) {
        return next(
            new ErrorHandler('Zmieniles swoje haslo, zaloguj sie ponownie.', 401)
        );
    }
    req.user = current;
    res.locals.user = current;
    next();
});
exports.restrictions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler('Nie masz pozwolenia na wykonanie tej akcji', 403)
            );
        }
        next();
    };
};
exports.userForgotPassword = catchAsync(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new ErrorHandler('Nie ma takiego uzytkownika z tym adresem email', 404)
        );
    }

    const reseToken = user.resetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')} 
        /remonty/users/resetUserPassword/${reseToken}`;
    const message = `Zapomniales Hasla? Uzyj tego Linku aby je zresetowac: ${resetURL}.\n`;

    try {
        await sendMail({
            email: user.email,
            subject: 'Twój token który jest ważny przez 10 minut',
            message: `
            ${resetURL}
            `,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token zostal wyslany na twój adres email!',
        });
    } catch (err) {
        user.passwdResetToken = undefined;
        user.passwdResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new ErrorHandler(
                'Wystapil blad przy wysylaniu wiadomosci, spróbuj ponownie!'
            ),
            500
        );
    }
});

exports.resetUserPassword = catchAsync(async(req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwdResetToken: hashedToken,
        passwdResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler('Nie prawidłowy token', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwdResetToken = undefined;
    user.passwdResetExpires = undefined;
    await user.save();

    createToken(user, 200, req, res);
});
exports.isLoggedIn = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            const current = await User.findById(decoded.id);
            if (!current) {
                return next();
            }

            if (current.timePasswordChanged(decoded.iat)) {
                return next();
            }

            res.locals.user = current;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

exports.updateLoginUserPassword = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.current, user.password))) {
        return next(new ErrorHandler('Twoje teraźniejsze hasło jest błędne!', 401));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createToken(user, 200, req, res);
});