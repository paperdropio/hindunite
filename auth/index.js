const { seq: { models: { users, userVerifications } }, seq } = require('../utility/orm')
const { QueryTypes } = require('sequelize');
const { numberGenerator } = require('../utility/numberGenerator');
const bcrypt = require('bcrypt')
const verificationResult = require('../enums/verificationResult');

const isEmailRegistered = async ({email}) => {
    const existingUser = await users.findOne({
        where: {
            email,
            isDeleted: false
        }
    });

    return existingUser && true;
}

const createUser = async ({email, name, password}) => {

    const hash = await bcrypt.hash(password, 10);

    const newUser = users.build({ name, email, password: hash });
    await newUser.save();

    return newUser.id && true;
}


const loginUser = async ({email, password}) => {

    const user = await users.findOne({
        where: {
            email,
            isDeleted: false
        }
    });

    if ( user ) {
        const passwordMatch = await bcrypt.compareSync(password, user.password);

        if ( passwordMatch ) {
            user.set({
                lastLoginOn: (new Date()),
                numOfFailedPasswordAttempt: 0
            });
        }
        else {
            user.set({
                numOfFailedPasswordAttempt: user.numOfFailedPasswordAttempt+1
            })
        }

        await user.update();

        return passwordMatch;
    }

    return false;
}


const logoutUser = async ({id}) => {

    const user = await users.findByPk(id);

    if ( user ) {
        user.set({
            lastLogout: (new Date())
        })

        await user.update();
    }
}

const sendVerificationEmail = async ({id, email}) => {

    const verificationCode = numberGenerator();
    
    const expiresOn = (new Date());
    expiresOn.setDate(expiresOn.getDate() + 1);
   
    const verificationRecord = userVerifications.build({ userId: id, verificationCode, expiresOn  })

    await verificationRecord.save();

    //send email here...
}

const verifyEmail = async ({verificationCode}) => {

    const verificationRecord = await userVerifications.findOne({
        where: {
            verificationCode: verificationCode,
            isDeleted: false
        }
    });

    if ( verificationRecord ) {
        if (verificationRecord.expiresOn < (new Date())) {
            return verificationResult.CODE_EXPIRED_ON;
        }

        if ( verificationRecord.verifiedOn){
            return verificationResult.CODE_ALREADY_VERIFIED;
        }

        const user = await users.findByPk(id);
        if ( user.isDeleted || user.isConfirmed ){
            return verificationResult.USER_ALREADY_VERIFIED;
        }
        
        verificationCode.set({
            verifiedOn: (new Date())
        })
        
        await verificationRecord.update();
        
        user.set({
            isConfirmed: true
        });
        await user.update();

        return verificationResult.VERIFIED;
    }
    
    return verificationResult.CODE_NOT_FOUND;
}

module.exports = {
    createUser, 
    isEmailRegistered,
    sendVerificationEmail,
    verifyEmail,
    loginUser,
    logoutUser
}