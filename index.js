const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
// app object -module scaffolding
const app = {};

// configuration
app.config = {
    port: 8000,
};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};
// handle reques response
app.handleReqRes = handleReqRes;

app.createServer();
