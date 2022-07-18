// smtp-relay.gmail.com
// 25, 465, 587 port
// SSL / TLS 프로토콜 사정
'use strict';

import nodemailer from 'nodemailer';
import fs from 'fs';

// import path from 'path';

export class SMTP {
    constructor() {

    }

    static getInstance() {
        if (this.exists != true)
            this.instance = new SMTP();

        this.exists = true;

        return this.instance;
    }

    async init() {
        // this.dir = path.resolve();
        this.data = await fs.readFileSync('./smtp/smtp.json');
        this.configure = JSON.parse(this.data);
    }

    async sendMail(request, response) {
        let transporter;
        let binData;
        let mailFormat;
        let certificationNumber;
        let toEmailAddress;

        toEmailAddress = this.getToEmailAddress(request);
        console.log(toEmailAddress);
        if (toEmailAddress == undefined) return;

        // 1. 메일 전송을 위한 전송자를 만든다.
        transporter = nodemailer.createTransport(this.configure);

        // 2. 파일을 읽어온다.
        binData = await fs.readFileSync('./smtp/mailFormat.json');

        // 3. 파일을 파싱한다.
        mailFormat = JSON.parse(binData);

        // 4. 인증번호를 만든다.
        certificationNumber = this.getCertificationNumber();

        // 5. 보낼 메일을 만든다.
        mailFormat.to = toEmailAddress;

        mailFormat.html += `<div class="certificationNumber">${certificationNumber}</div>`;
        console.log(mailFormat);

        await transporter.sendMail(mailFormat, (err, info) => {
            if (err) {
                response.send({message: "Error Failed to send mail"});
            } else {
                response.send({code: certificationNumber});
            }
            console.log(info)
        });
    }

    getToEmailAddress(request) {
        return request.body.id;
    }

    getCertificationNumber() {
        let certificationNumber = "";
        for (let i = 1; i <= 6; i++) {
            certificationNumber += Math.floor(Math.random() * 10);
        }

        return certificationNumber;
    }
}

// let smtp = new SMTP();
//
// await smtp.init();
//
// await smtp.sendMail("mailtest1563@gmail.com");