const { mongooseFindOne } = require('../../modules/mongoose/query');
const bcryptCompare = require('../../modules/bcrypt/compare');
const jwtSign = require('../../modules/jwt/sign');
const response = require('../../modules/response/response');
const index = require('../../index');
const account = require('../../database/schema/mongodb.account.schema');

const handleAuthentication = async(req, res) => {
    const accountEmail = req.body.accountEmail;
    const accountPassword = req.body.accountPassword;

    const existedAccount = await mongooseFindOne(account, 'email', accountEmail);

    if(existedAccount === null) {
        response(res, index, 'authentication', 'handle authentication: wrong email or password');        
    }
    else {
        const checkPassword = await bcryptCompare(accountPassword, existedAccount.password);

        if(checkPassword === false) {
            response(res, index, 'authentication', 'handle authentication: wrong email or password');
        }
        else {            
            const token = await jwtSign('email', accountEmail, index.jwtSecret, '12h');            
            
            //res.cookie('access_token', 'Bearer ' + token, { httpOnly: true });                    

            var storeId;

            if(existedAccount.store === '') {
                storeId = '';
            }
            else {
                storeId = existedAccount.store;
            }

            response(res, index, 'authentication', { 
                message: 'handle authentication: success',
                token: token,
                accountId: existedAccount._id,
                storeId: storeId
            });
        }
    }
}

module.exports = handleAuthentication;