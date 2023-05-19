module.exports =(roles)=>{

    return (req,res,next)=>{
        const role = res.locals.user?.role;
        if(roles.includes(role) && res.locals.user.isAdmin !=false){
            return next();
        }else if(!res.locals.user?.isAdmin){
          
            return res.status(403).send("erişim yetkiniz yok.");
      
        }else{
            return res.status(403).json({message:'Yetkisiz kullanıcı'})

        }
    }

}