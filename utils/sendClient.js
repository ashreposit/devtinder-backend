const {SESClient} = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION,credentials:{
    accessKeyId:CONFIG.AWS_SES_ACCESS_KEY,
    secretAccessKey:CONFIG.AWS_SES_SECRET_KEY
} });
module.exports.sesClient = sesClient ;