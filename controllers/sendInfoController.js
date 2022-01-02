const catchAsync = require('./../utils/catchAsync');
const ErrorHandler = require('./../utils/errorHandler');
const Roaduser = require('../models/roadUserModel');
const mongoose = require('mongoose');
const Road = require('../models/roadModel');
const nodemailer = require('nodemailer');

exports.sendEmail = catchAsync(async(req, res, next) => {
    const email = req.body.email;
    const data = await Roaduser.findOne({ email: email });
    const roads = [];
    if (data.drogi.length != 0) {
        const drogi = await Road.find({
            droga: { $in: data.drogi }
        });
        roads.push(...drogi);
    }
    if (data.wojewodztwa.length != 0) {
        const wojewodztwa = await Road.find({
            wojewodztwo: { $in: data.wojewodztwa },
        });
        roads.push(...wojewodztwa);
    }
    if (data.odcinki.length != 0) {
        const odcinki = await Road.find({
            odcinek: { $in: data.odcinki }
        });
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
            `REMONTY: \n droga: ${ro.droga} \n wojedztwo: ${ro.wojewodztwo} \n odcinek: ${ro.odcinek}`
        ),
    };
    await transporter.sendMail(mail);

    res.status(200);
});

exports.saveWoj = catchAsync(async(req, res, next) => {
    const { email, wojewodztwo } = req.body;
    const email1 = decodeURIComponent(email);
    const data = await Roaduser.findOne({ email: email1 });

    if (!data) {
        await Roaduser.create({
            email: email1,
            drogi: [],
            odcinki: [],
            wojewodztwa: [wojewodztwo],
        });
    } else {
        await Roaduser.updateOne({
            ...data,
            wojewodztwa: [...data.wojewodztwa, wojewodztwo],
        });
    }

    res.status(200);
});
exports.saveRoute = catchAsync(async(req, res, next) => {
    const { email, odcinek } = req.body;
    const email1 = decodeURIComponent(email);
    const data = await Roaduser.findOne({ email: email1 });

    if (!data) {
        await Roaduser.create({
            email: email1,
            drogi: [],
            odcinki: [odcinek],
            wojewodztwa: [],
        });
    } else {
        await Roaduser.updateOne({
            ...data,
            odcinki: [...data.odcinki, odcinek],
        });
    }

    res.status(200);
});
exports.saveNumberOfRoad = catchAsync(async(req, res, next) => {
    const { email, droga } = req.body;
    const email1 = decodeURIComponent(email);
    const data = await Roaduser.findOne({ email: email1 });

    if (!data) {
        await Roaduser.create({
            email: email1,
            drogi: [droga],
            odcinki: [],
            wojewodztwa: [],
        });
    } else {
        await Roaduser.updateOne({
            ...data,
            drogi: [...data.drogi, droga],
        });
    }
    res.status(200);
});