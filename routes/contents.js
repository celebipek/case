const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer')
// const { sendEmail } = require('../nodemail.js');
const auth = require("../middware/auth");
const isAdmin = require("../middware/isAdmin");
const role = require("../middware/role");


const {Content, Comment, validateContent} = require("../models/content");

router.get("/", [auth.authenticateToken,role(['ogrenci','ogretmen','admin'])], async (req, res) => {
    const contents = await Content.find()
    .populate({
        path :'user_id',
        select :'name'
    })
    .select('-updatedAt');
    res.status(200).json(contents);
});

router.post("/", [auth.authenticateToken,role(['ogretmen','admin'])], async (req, res) => {

    const { error } =  validateContent(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    

    const content = new Content({
        title: req.body.title,
        number: req.body.number,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
        comments: req.body.comments,
        user_id : res.locals.user.id
    });
    let transporter = nodemailer.createTransport({
         service: 'gmail',
          auth: {
             user: 'celebiipek870@gmail.com',
              pass: 'nhftpjynawbnxsdw'
             }
             }) 
             let mailOptions = {
                from: 'celebiipek870@gmail.com',
                 to: 'celebiipek871@gmail.com',
                  subject: 'Yeni İçerik Paylaşıldı '+ ", " +" içerik başlığı : " +req.body.title,
                   html: '<p>Açıklama :</p>'+req.body.description
                 }
                  transporter.sendMail(mailOptions, (err, data) => {
                     if(err) console.log(err)
                     else console.log('mail gonderildi') })
    

    const newContent = await content.save();
    res.send(newContent);
});

router.put("/comment/:id",async (req, res) => {
    const content = await Content.findById(req.params.id);
    if(!content) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }
    
    const comment = new Comment({
        text: req.body.text,
        username: req.body.username
    });

    content.comments.push(comment);

    const updatedContent = await content.save();
    res.send(updatedContent);
});

router.delete("/comment/:id",  async (req, res) => {
    const content = await Content.findById(req.params.id);
    if(!content) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }
    const comment = content.comments.id(req.body.commentid);
    comment.remove();

    const updatedContent = await content.save();
    res.send(updatedContent);
});

router.put("/:id", async (req, res) => {
    const content = await Content.findById(req.params.id);
    if(!content) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }

    const { error } = validateContent(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    content.name = req.body.name;
    content.number = req.body.number;
    content.description = req.body.description;
    content.imageUrl = req.body.imageUrl;
    content.isActive = req.body.isActive;
    

    const updatedContent = await content.save();

    res.send(updatedContent);
});

router.delete("/:id",  async (req, res) => {
    const content = await Content.findByIdAndDelete(req.params.id);

    if(!content) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }

    res.send(content);
});

router.get("/:id", async (req, res) => {
    const content = await Content.findById(req.params.id).populate("name -_id"); 

    if(!content) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }
    res.send(content);
});

router.get("/user/:id", async (req,res)=>{
    const content = await Content.find({user_id: req.params.id})
    .populate({
        path:'user_id',
        select : 'name'
    });

    res.status(200).json({data:content});
})

module.exports = router;