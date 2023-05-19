const express = require("express");
var swaggerUi = require('swagger-ui-express');
const app = express();

const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const contents = require("./routes/contents");
const users = require("./routes/users");
const {checkUser} = require("./middware/auth");



    
swaggerDocument = require('./swagger.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("*" ,checkUser);
app.use("/api/contents" ,contents);
app.use("/api/users" ,users);



(async () => {
    try {
        await mongoose.connect('mongodb+srv://celebi:qwe123@cluster0.qgb5rp0.mongodb.net');
        console.log("mongodb bağlantısı kuruldu.");
    }
    catch(err) {
        console.log(err);
    }
})();


app.listen(3000, () => {
    console.log("listening on port 3000");
});