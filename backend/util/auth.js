import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync(__dirname + '\/private.key');
const expiresIn = '3h';

export function generateJWTToken(accountId) {
    return jwt.sign({ accountId }, privateKey, {expiresIn: "3h"});
}

function sliceOffBearerFromToken(token) {
    const bearer = 'Bearer ';
    const bearerLocation = token.indexOf(bearer);
    if (bearerLocation === -1) {
        return "";
    }
    return token.substring(bearerLocation + bearer.length, token.length);
}

export function verifyJWTToken(token) {
    const tokenToTry = sliceOffBearerFromToken(token);
    if (tokenToTry === "") {
        return false;
    }
    try {
        return jwt.verify(tokenToTry, privateKey);
    } catch(e) {
        console.error(e);
        return null;
    }
}