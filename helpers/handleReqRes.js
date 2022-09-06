const url = require('url');
const { StringDecoder } = require('string_decoder');
// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    const decoder = new StringDecoder('utf-8');
    let decodedData = '';

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmendPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLocaleLowerCase();
    const quryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    console.log(parsedUrl);

    req.on('data', (buffer) => {
        decodedData += decoder.write(buffer);
    });
    req.on('end', () => {
        decodedData += decoder.end();
        console.log(decodedData);
        // response handle
        res.end('hello prithibi');
    });
};
module.exports = handler;
