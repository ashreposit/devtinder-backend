const nodemailer = require("nodemailer");

const createTransporter = async function (transporterData) {

    console.log({ CONFIGMAIL_HOST: CONFIG.MAIL_HOST, port: CONFIG.MAIL_PORT, mail: CONFIG.USER_MAIL, pass: CONFIG.USER_PASSWORD });

    try {
        let transporter = nodemailer.createTransport({
            host: transporterData?.mailHost || CONFIG.MAIL_HOST,
            port: transporterData?.mailPort || CONFIG.MAIL_PORT,
            secure: true,
            auth: {
                user: transporterData?.auth?.userMail || CONFIG.USER_MAIL,
                pass: transporterData?.auth?.password || CONFIG.USER_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        if (!transporter) {
            throw new Error("Error creating Transporter");
        }
        return transporter;
    }
    catch (err) {
        throw new Error(err.message);
    }
};
module.exports.createTransporter = createTransporter;

const sendMail = async function (transporter, mailOptions) {

    try {
        let sendMail = await transporter.sendMail(mailOptions);

        if (!sendMail) {
            throw new Error("Error sending email");
        }

        if (sendMail) return { msg: "mail send successfully!" };
    } catch (err) {
        throw new Error(err.message);
    }
};
module.exports.sendMail = sendMail;