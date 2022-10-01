

module.exports ={
    userlogin : (req,res,next)=>{
    if(req.session.userlogin){
        next();
    }else{
        res.redirect('/')
    }
}, 
    adminlogin : (req,res,next)=>{
        if(req.session.adminlogin){
            next()
        }else{
            res.redirect('/')
        }
    }
}