const { sampleHandler } = require('./handler/roteHandlers/sampleHandler');
const { userHandler } = require('./handler/roteHandlers/userHandler');
const { tokenHandler } = require('./handler/roteHandlers/tokenHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};
module.exports = routes;
