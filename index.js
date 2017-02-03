var crypto = require('crypto');
var b32 = require('thirty-two');
var notp = require('notp');

function generateSecret(options) {
    if (!options) options = {};
    var bin = crypto.randomBytes(20);
    var base32 = b32.encode(bin).toString('utf8').replace(/=/g, '');
    var secret = base32.toLowerCase().replace(/(\w{4})/g, "$1 ").trim().split(' ').join('').toUpperCase();
    var uri = 'otpauth://totp/' + encodeURIComponent(options.name || 'App') + encodeURIComponent(options.account ? ':' + options.account : '') + '%3Fsecret=' + secret;
    return {
        secret: secret,
        uri: uri,
        qr: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + uri
    };
};

function generateToken(secret) {
    if (!secret || !secret.length) return null;
    var unformatted = secret.replace(/\W+/g, '').toUpperCase();
    var bin = b32.decode(unformatted);
    return {
        token: notp.totp.gen(bin)
    };
};

function verifyToken(secret, token, window) {
    if (!secret || !secret.length || !token || !token.length) return null;
    if (!window) window = 4;
    var unformatted = secret.replace(/\W+/g, '').toUpperCase();
    var bin = b32.decode(unformatted);
    token = token.replace(/\W+/g, '');
    return notp.totp.verify(token, bin, {
        window: window,
        time: 30
    });
};

module.exports = exports = {
    generateSecret: generateSecret,
    generateToken: generateToken,
    verifyToken: verifyToken
};
