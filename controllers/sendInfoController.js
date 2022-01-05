const catchAsync = require('./../utils/catchAsync');
const ErrorHandler = require('./../utils/errorHandler');
const Roaduser = require('../models/roadUserModel');
const mongoose = require('mongoose');
const Road = require('../models/roadModel');
const nodemailer = require('nodemailer');
const _ = require('lodash');

exports.sendEmail = catchAsync(async(req, res, next) => {
    const email = decodeURIComponent(req.body.email);

    const data = await Roaduser.findOne({ email: email }).exec();
    if (!data) {
        return;
    }
    const roads = [];
    if (data.drogi.length != 0) {
        const drogi = await Road.find({
            droga: { $in: data.drogi },
        }).exec();
        roads.push(...drogi);
    }
    if (data.wojewodztwa.length != 0) {
        const wojewodztwa = await Road.find({
            wojewodztwo: { $in: data.wojewodztwa },
        }).exec();
        roads.push(...wojewodztwa);
    }
    if (data.odcinki.length != 0) {
        const odcinki = await Road.find({
            odcinek: { $in: data.odcinki },
        }).exec();
        roads.push(...odcinki);
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '39bc375184f050',
            pass: '11360dc851dd90',
        },
    });

    const mail = {
        from: 'wojtekdab15@gmail.com',
        to: email,
        subject: 'newsletter',
        text: roads.map(
            (ro) =>
            `
            REMONTY: \n droga: ${ ro.droga }\n
            wojedztwo: ${ ro.wojewodztwo }\n
            odcinek: ${ ro.odcinek }
            `
        ).join('\n'),
    };
    await transporter.sendMail(mail);

    res.status(200).render('afterSendInformations.pug');
});

exports.saveWoj = catchAsync(async(req, res, next) => {
    const { email, wojewodztwo } = req.body;
    const email1 = decodeURIComponent(email);
    const data = await Roaduser.findOne({ email: email1 }).exec();

    if (!data) {
        await Roaduser.create({
            email: email1,
            drogi: [],
            odcinki: [],
            wojewodztwa: [wojewodztwo],
        });
    } else {
        const { _id, ...rest } = data;
        await Roaduser.updateOne({ _id }, {
            email: rest.email,
            odcinki: rest.odcinki,
            drogi: rest.drogi,
            wojewodztwa: _.uniq([...data.wojewodztwa, wojewodztwo]),
        });
    }

    res.status(200).render('afterSendInformations.pug');
});
exports.saveRoute = catchAsync(async(req, res, next) => {
    const { email, odcinek } = req.body;
    const email1 = decodeURIComponent(email);
    const data = await Roaduser.findOne({ email: email1 }).exec();

    if (!data) {
        await Roaduser.create({
            email: email1,
            drogi: [],
            odcinki: [odcinek],
            wojewodztwa: [],
        });
    } else {
        const { _id, ...rest } = data;
        await Roaduser.updateOne({ _id }, {
            email: rest.email,
            drogi: rest.drogi,
            wojewodztwa: rest.wojewodztwa,
            odcinki: _.uniq([...data.odcinki, odcinek]),
        });
    }

    res.status(200).render('afterSendInformations.pug');
});

exports.saveNumberOfRoad = catchAsync(async(req, res, next) => {
    const { email, droga } = req.body;
    const email1 = decodeURIComponent(email);
    const data = await Roaduser.findOne({ email: email1 }).exec();

    if (!data) {
        await Roaduser.create({
            email: email1,
            drogi: [droga],
            odcinki: [],
            wojewodztwa: [],
        });
    } else {
        const { _id, ...rest } = data;
        await Roaduser.updateOne({ _id }, {
            email: rest.email,
            odcinki: rest.odcinki,
            wojewodztwa: rest.wojewodztwa,
            drogi: _.uniq([...data.drogi, droga]),
        });
    }
    res.status(200).render('afterSendInformations.pug');
});