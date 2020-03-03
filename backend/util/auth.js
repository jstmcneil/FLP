import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync(__dirname + '\\private.key');
const expiresIn = '3h';

export function generateJWTToken(accountId) {
    return jwt.sign({ accountId }, privateKey, {expiresIn: expiresIn});
}

export function verifyJWTToken(token) {
    try{
        return jwt.verify(token, privateKey);
    } catch(e) {
        console.error(e);
        return null;
    }
}