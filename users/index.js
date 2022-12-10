const { seq } = require('../utility/orm')
const GenericResponse = require('../common/response');

const getUsers = async ({ userId }) => {

    const { users } = seq.models;
    const userRecords = await users.findAll({
        where: {
            id: userId
        }
    });

    const items = (userRecords ?? []).map((u) => ({
            id: u.id,
            name: u.name,
        }));

    return GenericResponse.success({ items });
}

module.exports = {
    getUsers,
}