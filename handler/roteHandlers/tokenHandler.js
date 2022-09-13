const { hash, perseJSON, createRandomString } = require('../../helpers/utilities');
const data = require('../../lib/data');

const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { message: 'method  error' });
    }
};
handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedPassoerd = hash(password);
            if (hashedPassoerd === perseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };
                // store the token
                data.create('tokens', tokenId, tokenObject, (error2) => {
                    if (!error2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!',
        });
    }
};

handler._token.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.quryStringObject.id === 'string' &&
        requestProperties.quryStringObject.id.trim().length === 20
            ? requestProperties.quryStringObject.id
            : false;

    if (id) {
        data.read('tokens', id, (error, tokenData) => {
            const token = { ...perseJSON(tokenData) };
            if (!error && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Request data was not found!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'There is request error!',
        });
    }
};

handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );
    if (id && extend) {
        data.read('tokens', id, (error1, tokenData) => {
            const tokenObject = { ...perseJSON(tokenData) };
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store update
                data.update('tokens', id, tokenObject, (error2) => {
                    if (!error2) {
                        callback(200, { message: 'Token Successfully updated!' });
                    } else {
                        callback(500, { error: 'There was a server side error!' });
                    }
                });
            } else {
                callback(400, {
                    error: 'Token already expired!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'There is request error!',
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    if (id) {
        data.read('tokens', id, (error1, tokenData) => {
            if (!error1 && tokenData) {
                data.delete('tokens', id, (error2) => {
                    if (!error2) {
                        callback(200, {
                            message: 'Token successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a server side error!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (error, tokenData) => {
        if (!error && tokenData) {
            if (perseJSON(tokenData).phone === phone && perseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};
module.exports = handler;
