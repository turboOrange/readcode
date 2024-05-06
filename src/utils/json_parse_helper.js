
const escape = (openaiResponse) => {
    const res = openaiResponse.replace('/\n/g','\\n')
                         .replace('/\t/g','\\t')
                         .replace('/\r/g','\\r');

    return res;
}

module.exports = {
    escape
}