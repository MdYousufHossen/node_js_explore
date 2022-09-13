const { hash, perseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    console.log('8 userHandler.js', requestProperties.method);
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { message: 'method  error' });
    }
};
handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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
    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that user doesn't already exists
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not create user!',
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
handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.quryStringObject.phone === 'string' &&
        requestProperties.quryStringObject.phone.trim().length === 11
            ? requestProperties.quryStringObject.phone
            : false;

    if (phone) {
        // verify token
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // Lookup the user
                data.read('users', phone, (error, u) => {
                    const user = { ...perseJSON(u) };
                    if (!error && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user was not found!',
                        });
                    }
                });
            } else {
                callback(404, { error: 'Authentication failed!' });
            }
        });
    } else {
        callback(404, {
            error: 'Wrong Request!',
        });
    }
};
handler._users.put = (requestProperties, callback) => {
    //    check the phone number is valid
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone) {
        if (firstName || lastName || password) {
            const token =
                typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false;

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    // lookup the user
                    data.read('users', phone, (error1, uData) => {
                        const userData = { ...perseJSON(uData) };
                        if (!error1 && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            // store to database
                            data.update('users', phone, userData, (error2) => {
                                if (!error2) {
                                    callback(200, {
                                        message: 'User was updated successfully!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was a proble in the server side!',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'Phone number is not matched!',
                            });
                        }
                    });
                } else {
                    callback(404, { error: 'Authentication failed!' });
                }
            });
        } else {
            callback(400, { error: 'You have to edit filed! ' });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number,Please try again!',
        });
    }
};
handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.quryStringObject.phone === 'string' &&
        requestProperties.quryStringObject.phone.trim().length === 11
            ? requestProperties.quryStringObject.phone
            : false;

    if (phone) {
        // verify token.......
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup the user
                data.read('users', phone, (error1, userData) => {
                    if (!error1 && userData) {
                        data.delete('users', phone, (error2) => {
                            if (!error2) {
                                callback(200, {
                                    message: 'User was successfully deleted!',
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'Phone number did not matched!',
                        });
                    }
                });
            } else {
                callback(404, { error: 'Authentication failed!' });
            }
        });
    } else {
        callback(400, {
            error: 'Invalid phone number,Please try again!',
        });
    }
};

module.exports = handler;
