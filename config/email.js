const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'Gmail',
        pass: 'password'
    }
});

const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        await transporter.sendMail({
            from: 'gmail',
            to: email,
            subject: 'Reset your password',
            text: `Your OTP for resetting your password is ${otp}`
        });

        return otp;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { sendOTP };
