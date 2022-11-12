const { seq } = require('../utility/orm')
const { numberGenerator } = require('../utility/numberGenerator');
const bcrypt = require('bcrypt')
const verificationResult = require('../enums/verificationResult');
const createUserResult = require('../enums/createUserResult');
const loginUserResult = require('../enums/loginUserResult');
const GenericResponse = require('../common/response');

const isEmailRegistered = async ({ email }) => {

    const { users } = seq.models;
    const existingUser = await users.findOne({
        where: {
            email,
            isDeleted: false
        }
    });

    return existingUser && true;
}

const createUser = async ({ email, name, password }) => {
    const { users } = seq.models;
    const emailReg = await isEmailRegistered({ email });

    if (emailReg) {
        const user = await users.findOne({
            where: {
                email
            }
        });

        if (user.isConfirmed) {
            return GenericResponse.failed(createUserResult.EMAIL_ALREADY_REGISTERED);
        }

        return GenericResponse.failed(createUserResult.USER_ACCOUNT_NOT_CONFIRMED);
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = users.build({ name, email, password: hash });
    await newUser.save();

    return GenericResponse.success({ id: newUser.id });
}

const loginUser = async ({ email, password }) => {
    const { users } = seq.models;

    const user = await users.findOne({
        where: {
            email,
            isDeleted: false
        }
    });

    if (user) {

        if (!user.isConfirmed) {
            return GenericResponse.failed({ code: loginUserResult.USER_NOT_CONFIRMED });
        }

        const passwordMatch = await bcrypt.compareSync(password, user.password);

        if (passwordMatch) {
            user.set({
                lastLoginOn: (new Date()),
                numOfFailedPasswordAttempt: 0
            });
        }
        else {
            user.set({
                numOfFailedPasswordAttempt: user.numOfFailedPasswordAttempt + 1
            })
        }

        await user.save();

        return GenericResponse.success({ id: user.id });
    }

    return GenericResponse.failed();
}

const logoutUser = async ({ id }) => {

    const { users } = seq.models;

    const user = await users.findByPk(id);

    if (user) {
        user.set({
            lastLogout: (new Date())
        })

        await user.update();
    }
}

const sendVerificationEmail = async ({ email }) => {

    const { userVerifications, users } = seq.models;

    const user = await users.findOne({
        where: {
            email
        }
    });

    if (!user) {
        return GenericResponse.failed();
    }

    if (user.isConfirmed) {
        return GenericResponse.failed();
    }

    await userVerifications.update(
        {
            expiresOn: (new Date())
        },
        {
            where: {
                userId: id
            }
        }
    );

    const verificationCode = numberGenerator();

    const expiresOn = (new Date());
    expiresOn.setDate(expiresOn.getDate() + 1);

    const verificationRecord = userVerifications.build({ userId: id, verificationCode, expiresOn })

    await verificationRecord.save();

    return GenericResponse.success();
}

const verifyEmail = async ({ verificationCode }) => {
    const { userVerifications, users } = seq.models;

    const verificationRecord = await userVerifications.findOne({
        where: {
            verificationCode: verificationCode,
            isDeleted: false
        }
    });

    if (verificationRecord) {
        if (verificationRecord.expiresOn < (new Date())) {
            return GenericResponse.failed({ code: verificationResult.CODE_EXPIRED_ON });
        }

        if (verificationRecord.verifiedOn) {
            return GenericResponse.failed({ code: verificationResult.CODE_ALREADY_VERIFIED });
        }

        const user = await users.findByPk(verificationRecord.id);
        if (user.isDeleted || user.isConfirmed) {
            return GenericResponse.failed({ code: verificationResult.USER_ALREADY_VERIFIED });
        }

        verificationRecord.set({
            verifiedOn: (new Date())
        })

        await verificationRecord.save();

        user.set({
            isConfirmed: true
        });
        await user.save();

        return GenericResponse.success({ code: verificationResult.VERIFIED });
    }

    return GenericResponse.failed({ code: verificationResult.CODE_NOT_FOUND });
}

module.exports = {
    createUser,
    isEmailRegistered,
    sendVerificationEmail,
    verifyEmail,
    loginUser,
    logoutUser
}