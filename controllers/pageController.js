const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const APIhandler = require('../utils/apiHandler');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
const Road = require('../models/roadModel');

exports.signUp = (req, res) => {
    res.status(200).render('signup.pug', {
        title: 'Rejestracja',
    });
};

exports.getLoginForm = (req, res) => {
    res.status(200).render('signin.pug', {
        title: 'Logowanie',
    });
};
exports.scrapowanie = (req, res) => {
    res.status(200).render('scraper.pug', {});
};
exports.scrap = catchAsync(async(req, res, next) => {
    await Road.deleteMany({});
    const scraper = require('../scraper.js');
    await scraper.main();
    res.status(200);
});

exports.getAccount = (req, res) => {
    res.status(200).render('loggedUserOrAdmin.pug', {
        title: 'Twoje Konto',
    });
};

exports.updateUserData = catchAsync(async(req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id, {
            name: req.body.name,
            email: req.body.email,
        }, {
            new: true,
            runValidators: true,
        }
    );
});
exports.newRoad = catchAsync(async(req, res, next) => {
    const road = await Road.create({
        droga: req.body.droga,
        odcinek: req.body.odcinek,
        wojewodztwo: req.body.wojewodztwo,
        rodzaj: req.body.rodzaj,
        rozpoczecie: req.body.rozpoczecie,
        zakonczenie: req.body.zakonczenie,
    });
    if (!road) {
        return next(new ErrorHandler('Nie udalo sie dodac nowego remontu', 404));
    }
    res.status(200).render('newRoad.pug', {
        title: 'Nowy Remont',
        road,
    });
});

exports.getOverview = catchAsync(async(req, res, next) => {
    res.status(200).render('loggedUserOrAdmin.pug', {
        title: 'Zalogowany użytkownik',
    });
});

exports.contactForm = catchAsync(async(req, res, next) => {
    res.status(200).render('contact.pug');
});
exports.contactFormInformations = catchAsync(async(req, res, next) => {
    res.status(200).render('afterSendInformations.pug');
});
exports.send = catchAsync(async(req, res, next) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '39bc375184f050',
            pass: '11360dc851dd90',
        },
    });
    let form = new multiparty.Form();
    let data = {};

    form.parse(req, function(err, fields) {
        //console.log(fields);
        Object.keys(fields).forEach(function(property) {
            data[property] = fields[property].toString();
        });
        //console.log(data);
        const mail = {
            sender: `${data.name} <${data.email}>`,
            to: 'wojtekdab15@gmail.com', // receiver email,
            subject: 'Formularz Kontaktowy z informacjami o remoncie',
            text: `${data.name} <${data.email}> \n${data.rodzaj} \n${data.opis}\n${data.adres}`,
        };
        transporter
            .sendMail(mail)
            .then(() => res.status(200).render('afterSendInformations.pug'));
    });
});
exports.polishMap = catchAsync(async(req, res, next) => {
    res.status(200).render('mapPol.pug');
});

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const features = new APIhandler(User.find(), req.query).filter();
    const user = await features.query;

    User.find({}, function(err, User) {
        res.render('wszyscyUserzy.ejs', {
            userList: User,
        });
    });
});
exports.mainPag = catchAsync(async(req, res, next) => {
    res.status(200).render('mainPage.pug');
});
exports.voivodeship = catchAsync(async(req, res, next) => {
    res.status(200).render('voivodeship.pug');
});
exports.numberOfRoad = catchAsync(async(req, res, next) => {
    res.status(200).render('road.pug');
});
exports.town = catchAsync(async(req, res, next) => {
    res.status(200).render('town.pug');
});

exports.changePasswd = catchAsync(async(req, res, next) => {
    res.status(200).render('changePassword.pug');
});