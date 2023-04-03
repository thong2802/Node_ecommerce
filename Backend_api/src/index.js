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


const protect = require('./controllers/protect/protect');

const handleRegistration = require('./controllers/registration/handle-registration');
const handleAuthentication = require('./controllers/authentication/handle-authentication');


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


//run
app.listen(appPort, () => { console.log(appPort) });