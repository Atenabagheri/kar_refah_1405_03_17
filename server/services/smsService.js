const MelipayamakApi = require("melipayamak");

const smsService = (phone, code, bodyId) => {
  console.log(`Sending OTP ${code} to ${phone}`);
  // const username = process.env.SMS_USERNAME
  // const password = process.env.SMS_PASSWORD
  // const api = new MelipayamakApi(username, password);
  // const smsRest = api.sms();
  // const to = phone;
  // smsRest.sendByBaseNumber(code, to, bodyId);
};
module.exports = smsService;
