const { mongoose, Schema } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum : ['ogrenci','ogretmen','admin'],
        default : 'ogrenci'
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean
}, { timestamps: true ,versionKey:false});

function validateRegister(user) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(50).required().email(),
        password: Joi.string().min(5).required(),
    });

    return schema.validate(user);
}

function validateLogin(user) {
    const schema = new Joi.object({
        email: Joi.string().min(3).max(50).required().email(),
        password: Joi.string().min(5).required(),
    });

    return schema.validate(user);
}

userSchema.methods.createAuthToken = function() {
    const decodedToken = jwt.sign({ _id: this._id, isAdmin: this.isAdmin },'b918440fc60846a9627865e6425ffbbfc7568a9f20aca9',{expiresIn: '1h'} );
    return decodedToken;
};

const user = mongoose.model("User", userSchema);

module.exports = { user, validateRegister, validateLogin };