const cron = require('node-cron');
const {subDays, startOfDay, endOfDay} = require('date-fns');
const ConnectionRequest = require('../model/connectionRequest');
const sendEmail = require('./sendEmail');

// This job will run at 8 AM everyday.
cron.schedule('0 8 * * *',async()=>{
    // send email to all people who got requests last day

    console.log({info:"sending mail"});

    try {
        let yesterdayDate = subDays(new Date(),1);

        let yesterdayStart = startOfDay(yesterdayDate);
        let yesterdayEnd = endOfDay(yesterdayDate);

        let pendingRequests = await ConnectionRequest.find({
            status:'interested',
            createdAt:{
                $gte:yesterdayStart,
                $lt:yesterdayEnd
            }
        }).populate('fromUserId toUserId');

        let userMails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];

        for(let email of userMails){
            try {
                let sendMail = await sendEmail.run({subject:`New Friend request pending for ${email}`,body:`You have send a connection request on ${yesterdayDate}.Please log into devtinder for information on pending request.`});
                console.log(sendMail);
            } catch (error) {
                console.log(error);
            }
        }

    } catch (error) {
        console.log(error);
    }
});