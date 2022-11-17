const userModel = require('./user.model')
const userVerificationModel = require('./userVerification.model')
const settingsModel = require('./settings.model')
const campaignUsersModel = require('./campaignUsers.model')
const campaignsModel = require('./campaigns.model')

module.exports = async (seq) => {
    const users = userModel(seq);
    await users.sync();

    const userVerifications = userVerificationModel(seq);
    await userVerifications.sync();

    const settings = settingsModel(seq);
    await settings.sync(); 

    const campaignUsers = campaignUsersModel(seq);
    await campaignUsers.sync(); 

    const campaigns = campaignsModel(seq);
    await campaigns.sync(); 
}