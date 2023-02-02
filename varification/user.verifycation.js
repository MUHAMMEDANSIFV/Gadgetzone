
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);
const dotenv = require('dotenv').config()

module.exports = {

    massegesend: (mobile) => {
        client.verify.v2.services
            .create({
                friendlyName: 'Electro'
            })
            .then(service => console.log(service.sid));
        client.verify.v2.services(process.env.TWILIO_MESSAGING_SERVICE_SID)
            .verifications
            .create({
                to: '+91' + mobile,
                channel: 'sms'
            }).then(verification => console.log(verification)).catch((err) => console.log(err))
    },
    messageverifycation: (mobile, otp) => {
        // return new Promise((resolve, reject) => {
        //     client.verify.v2.services(process.env.TWILIO_MESSAGING_SERVICE_SID)
        //         .verificationChecks
        //         .create({
        //             to: '+91'+ mobile,
        //             code: otp
        //         })
        //         .then(verification_check => {
        //             console.log(verification_check.status)
        //             if (verification_check.status) {
        //                 resolve(verification_check)
        //                 console.log('otp is correct');
        //             } else {
        //                 reject()
        //                 console.log('otp is wrong');
        //             }
        //         }).catch((err) => {
        //             console.log(err);
        //         })
        // })
        console.log('hi')
    }

}
