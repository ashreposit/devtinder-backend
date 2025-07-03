const {SendEmailCommand} = require("@aws-sdk/client-ses");
const {sesClient} = require("./sendClient");

const createSendEmailCommand = (toAddress, fromAddress,requestMessage) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `${requestMessage?.body}`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `${requestMessage?.subject}`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    ],
  });
};

const run = async (message) => {
  const sendEmailCommand = createSendEmailCommand(
    "ashalaxmima@gmail.com",
    "anithaasha12@gmail.com",
    message
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports.run = run;