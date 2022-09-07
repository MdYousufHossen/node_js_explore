const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
// const data = require('./lib/data');
// app object -module scaffolding
const app = {};

// configuration
// app.config = {
//     port: 8000,
// };

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`16 index.js listening to port ${environment.port} env=${environment.envName}`);
    });
};
// handle reques response
app.handleReqRes = handleReqRes;

app.createServer();
