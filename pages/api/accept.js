const _ = require('lodash');
const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');
const mailgun = require("mailgun-js");

const mg = mailgun({
  apiKey: process.env.MG_API_KEY,
  domain: process.env.MG_DOMAIN,
});

/* API endpoint callable at `/api/accept` that allows us to accept
 * V1 invite requests and invite members into the community
 */
export default async function handler(req, res) {
  if (req.method == 'POST') {
    const { accessToken, applicantEmails } = req.body;

    // check if access token matches correct token
    const tokenHash = crypto.createHash('sha256').update(accessToken).digest('hex');
    console.log("token:", process.env.ACCESS_TOKEN);
    if (tokenHash !== process.env.ACCESS_TOKEN) {
      console.log(process.env.ACCESS_TOKEN);
      res.statusCode = 403;
      res.send({ success: false });
    }

    // accept users
    const url = "https://script.google.com/macros/s/AKfycbyTZNGNEcEiv7qty9RxkiysAgQi64swfV80dKDWwLrhSbp3oA2b/exec"
    const response = await axios.post(url, { emails: applicantEmails });
    
    if (!response.data.result) {
      res.statusCode = 400;
      return res.send({ success: false });
    }

    // deliver acceptance emails
    //const acceptedEmails = respopnse.data.result;
    const data = {
      from: "V1 Team <team@v1michigan.com>",
      to: process.env.TEST_EMAIL,
      subject: "Congrats!",
      text: "We're impressed. Welcome to the V1 Network."
    };

    mg.messages().send(data, (err, body) => {
      console.log(body);
      res.send({ success: !err, err: body });
    });

  } else {
    res.statusCode = 405;
    res.end();
  }
}
