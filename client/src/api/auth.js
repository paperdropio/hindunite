import axios from "axios";

export const login = async ({email, password}) => {
    const { data: { success, message }} = await axios.post('/api/users/loginUser', {email, password});

    return {success, message};
}


export const logout = async () => {
    const { data: { success, message }} = await axios.post('/api/users/logout');

    return {success, message};
}

export const registerUser = async ({name, email, password}) => {
    const { data: { success, message }} = await axios.post('/api/users/createUser', {name, email, password});

    return {success, message};
}

export const verifyEmail = async ({verificationCode}) => {
    const { data: { success, message }} = await axios.post('/api/users/verifyEmail', {verificationCode});

    return {success, message};
}