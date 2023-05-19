const jwt = require("jsonwebtoken");
const User = require('../models/user');

const checkUser = async (req, res, next) => {
    const token = req.cookies?.access_token;
    if (token) {
        jwt.verify(token, 'b918440fc60846a9627865e6425ffbbfc7568a9f20aca9', async (err, data) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
    
          const getUser = await User.user.findById(data._id).select('-password');
          res.locals.user = getUser;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

  const authenticateToken = async (req, res, next) => {

    try {
      const token = req.cookies?.access_token;
  
      if (token) {
        jwt.verify(token, 'b918440fc60846a9627865e6425ffbbfc7568a9f20aca9', async (err, user) => {
          if (err) {
            return res.status(403).json({message:'Giris yok'})
          } else {
            next();
          }
        });
      } else {
        return res.status(401).json({message:'Giris Yapilmadi'})
      }
    } catch (error) {
      res.status(401).json({
        status: false,
        message: 'Not Authorized',
      });
    }
  };

  module.exports= {
    checkUser,
    authenticateToken,
  }