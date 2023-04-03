const mongoose = require("mongoose");
const index = require("../../index");

const mongodbConfig = () => {            
    mongoose.connect(index.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
    .then(() => { 
        console.log("mongodb connected"); 
    })
    .catch((error) => { 
        console.log(error);
    });
}

module.exports = mongodbConfig;