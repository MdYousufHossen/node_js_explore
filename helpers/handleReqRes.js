const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handler/roteHandlers/notFoundHandler');
const { perseJSON } = require('./utilities');
// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmendPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLocaleLowerCase();
    const quryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmendPath,
        method,
        quryStringObject,
        headersObject,
    };
    const decoder = new StringDecoder('utf-8');
    let decodedData = '';
    const chosenHandler = routes[trimmendPath] ? routes[trimmendPath] : notFoundHandler;
    req.on('data', (buffer) => {
        decodedData += decoder.write(buffer);
    });
    req.on('end', () => {
        decodedData += decoder.end();
        requestProperties.body = perseJSON(decodedData);
        chosenHandler(requestProperties, (status, payloadData) => {
            console.log('35 handleReqRes', status, payloadData);
            let payload = payloadData;
            let statusCode = status;

            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final response
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};
module.exports = handler;
