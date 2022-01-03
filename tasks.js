const cron = require('node-cron');
const Road = require('./models/roadModel');
const Roaduser = require('./models/roadUserModel');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
cron.schedule('0 */23 * * *', async() => {

    const users = await Roaduser.find({}).exec();
    for (const data of users) {
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
        console.log(roads, 'drogi');

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
            to: data.email,
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

        console.log(mail.text);

        await transporter.sendMail(mail);
    }
});