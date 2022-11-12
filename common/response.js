const success = (props) => {
    return {
        success: true, 
        ...props
    }
}

const failed = (message, props) => {
    return {
        success: false, 
        message,
        ...props
    }
}

module.exports = {
    success, 
    failed
}