const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtVerify = async(token, secret) => {
    const verifyAsync = promisify(jwt.verify).bind(jwt);    
    try {
        await verifyAsync(token, secret, (err, match) => {
            if(err && err.name === 'TokenExpiredError') { 

            }
            if(!match) {
                return 'miss';
            }
            if(match) {
                return 'success';
            }
        });
    } catch (error) {
        return 'miss';
    }
    
    
}

module.exports = jwtVerify;