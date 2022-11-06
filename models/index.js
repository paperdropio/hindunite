const userModel = require('./user.model')
const userVerificationModel = require('./userVerification.model')
const settingsModel = require('./settings.model')

module.exports = async (seq) => {
    const seq = userModel(seq);
    await users.sync({ alter: true});

    const userVerifications = userVerificationModel(seq);
    await userVerifications.sync({ alter: true});

    const settings = settingsModel(seq);
    await settings.sync({ alter: true});
}