const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    username: String,
    date: {
        type: Date,
        default: Date.now
    },
    // user: { type: Schema.Types.ObjectId, ref: "User"}
}, { autoCreate: false});

const contentSchema = mongoose.Schema({
    title: String,
    number: Number,
    description: String,
    imageUrl: String,
    isActive: Boolean,
    user_id : {type: Schema.Types.ObjectId , ref: 'User'},
    comments: [commentSchema]
},{timestamps: true,versionKey:false});

function validateContent(content) {
    const schema = new Joi.object({
        title: Joi.string().min(3).max(30).required(),
        number: Joi.number().required(),
        description: Joi.string(),
        imageUrl: Joi.string(),
        isActive: Joi.boolean(),
        comments: Joi.array()
    });

    return schema.validate(content);
}

const Content = mongoose.model("Content", contentSchema); 
const Comment = mongoose.model("Comment", commentSchema); 

module.exports = { Content, Comment, validateContent };