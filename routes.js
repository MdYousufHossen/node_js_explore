const { sampleHandler } = require('./handler/roteHandlers/sampleHandler');
const { userHandler } = require('./handler/roteHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};
module.exports = routes;
