const GenericResponse = require('../common/response');
const { seq } = require('../utility/orm')
const { v4: uuid } = require('uuid');

const createCampaign = async ({campaignType, name, description, location, dueDate, steps, tags, totalUsersRequired, userId}) => {
    const { campaigns } = seq.models;

    const camp = campaigns.build({id: uuid(), 
                    campaignType, 
                    name,   
                    description, 
                    createdByUserId: userId,
                    location,
                    dueDate,
                    steps: JSON.stringify(steps ?? ""), 
                    tags: JSON.stringify(tags), 
                    totalUsersRequired});

    await camp.save();

    return GenericResponse.success({id: camp.id});
}


const updateCampaign = async ({campaignId, campaignType, name, description, steps, tags, totalUsersRequired, userId}) => {
    
    const { campaigns } = seq.models;

    const camp = await getCampaign({ campaignId });

    if (camp) {
        if(camp.createdByUserId !== userId){
            return GenericResponse.failed({message: 'Unauthorized'});
        } 

        if (totalUsersRequired < camp.totalUserRegistered){
            return GenericResponse.failed({message: 'Total users registered more than the users required'});
        }

        const campRecord = await campaigns.findByPk(campaignId);

        campRecord.set({
            campaignType, 
            name, 
            description, 
            steps: JSON.stringify(steps ?? ""), 
            tags: JSON.stringify(tags ?? ""),
            totalUsersRequired
        });

        await campRecord.save();

        return GenericResponse.success();
    }

    await camp.save();

    return GenericResponse.success({id: camp.id});
}

const getCampaign = async ({campaignId}) => {
    const { campaigns, campaignUsers } = seq.models;

    const campRecord = await campaigns.findByPk(campaignId);

    if ( campRecord) {
        const userList = await campaignUsers.findAndCountAll({
            where: {
                campaignId
            }
        });

        console.log(userList.rows);

        return GenericResponse.success({record: {
            ...campRecord.dataValues,
            tags: JSON.parse(campRecord.tags),
            steps: JSON.parse(campRecord.steps),
            registeredUsers: userList.count,
            users: userList.rows?.map((row) => row.userId) ?? []
        }});
    }

    await camp.save();

    return GenericResponse.success({id: camp.id});
}

const joinCampaign = async ({campaignId, userId}) => {
    const { campaigns, campaignUsers } = seq.models;

    const camp = await campaigns.findByPk(campaignId);

    if (camp) {
        const campaignUser = await campaignUsers.findOne({
            where: {
                userId,
                campaignId
            }
        });

        if (!campaignUser){
            const user = campaignUsers.build({campaignId, userId });
            await user.save();

            return GenericResponse.success();
        }

        return GenericResponse.failed({message: 'Already joined'});
    }
    
    return GenericResponse.failed({message: 'No campaign'});
}

module.exports = {
    createCampaign,
    joinCampaign,
    updateCampaign,
    getCampaign,
};