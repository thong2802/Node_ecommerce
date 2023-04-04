//libs
const dotenv = require('dotenv'); dotenv.config();
const helmet = require('helmet');
const redis = require('redis');
const nodemailer = require('nodemailer');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongodbConfig = require('./database/config/mongodb.config');

//controllers

//controllers
const checkConnection = require('./controllers/connection/check-connection');

const protect = require('./controllers/protect/protect');

const handleRegistration = require('./controllers/registration/handle-registration');
const handleAuthentication = require('./controllers/authentication/handle-authentication');

const loadAccountManageInfo = require('./controllers/info/load-account-manage-info');
const editAccountInfo = require('./controllers/account/edit-account-info');
const changeAccountPassword = require('./controllers/account/change-account-password');
const updateAccountAvatar = require('./controllers/account/update-account-avatar');
const forgotAuthenticationPassword = require('./controllers/authentication/forgot-authentication-password');
const resetAuthenticationPassword = require('./controllers/authentication/reset-authentication-password');

const postProductDetail = require('./controllers/product/post-product-detail');
const loadProductDetail = require('./controllers/product/load-product-detail');
const deleteProduct = require('./controllers/product/delete-product');
const searchProduct = require('./controllers/product/search-product');
const editProductDetail = require('./controllers/product/edit-product-detail');
const deleteProductDetail = require('./controllers/product/delete-product-detail');
const addProductDetail = require('./controllers/product/add-product-detail');
const postProductComment = require('./controllers/product/post-product-comment');
const loadProductListOnCategory = require('./controllers/product/load-product-list-on-category');
const loadProductListOnName = require('./controllers/product/load-product-list-on-name');
const loadBestSellingList = require('./controllers/product/load-best-selling-list');
const loadNewProductList = require('./controllers/product/load-new-product-list');
const loadDiscountList = require('./controllers/product/load-discount-list');


//config
const app = express();
const appPort = process.env.APP_PORT;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const emailService = process.env.EMAIL_SERVICE;
const emailServiceAccount = process.env.EMAIL_SERVICE_ACCOUNT;
const emailServicePassword = process.env.EMAIL_SERVICE_PASSWORD;

module.exports.jwtSecret = process.env.JWT_SECRET;
module.exports.mongodbUrl = process.env.MONGODB_URL;
module.exports.clientUrl = process.env.CLIENT_URL;
module.exports.clientRedis = redis.createClient(redisPort, redisHost);
module.exports.emailTransporter = nodemailer.createTransport({
    service: emailService,
    auth: {
        user: emailServiceAccount,
        pass: emailServicePassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

mongodbConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
app.use(logger("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: [ "Content-Type", "Origin", "Authorization", "X-Requested-With", "Accept" ],
    methods: "GET, POST"
}));

//routes
app.get('/api/', checkConnection);

app.post('/api/registration', handleRegistration);

app.post('/api/authentication', handleAuthentication);
app.post('/api/authentication/password/forgot', forgotAuthenticationPassword);
app.post('/api/authentication/password/reset', resetAuthenticationPassword);

//run
app.listen(appPort, () => { console.log(appPort) });