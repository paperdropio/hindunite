const info = (props) => {
    console.log(props);
}

const warn = (props) => {
    console.warn(props);
}

const error = (props) => {
    console.error(props);
}

module.exports = {
    info, 
    warn,
    error,
}