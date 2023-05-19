const express = require("express");
const router = express.Router();
const { validateLogin, validateRegister, user } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
    res.send();
});

// api/users/create : POST
router.post("/create", async (req, res) => {
    const { error } = validateRegister(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    let users = await user.findOne({ email: req.body.email });

    if(users) {
        return res.status(400).send("bu mail adresiyle zaten bir kullanıcı mevcut.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    await users.save();

    const token = users.createAuthToken();

    res.status(200).json({message: 'Kullanici olusturuldu.'})
});

// api/users/auth : POST
router.post("/auth", async (req, res) => {
    const { error } = validateLogin(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    let users = await user.findOne({ email: req.body.email });
    if(!users) {
        return res.status(400).send("hatalı email ya da parola");
    }

    const isSuccess = await bcrypt.compare(req.body.password, users.password);
    if(!isSuccess) {
        return res.status(400).send("hatalı email ya da parola");
    }

    const token = users.createAuthToken();

    res.cookie('access_token',token,{
        httpOnly: true,
        maxAge: 1000*60*60*1
    });

    res.status(200).json({message: 'success'});
});


module.exports = router;