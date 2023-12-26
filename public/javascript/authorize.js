function authorize(req, res, next){
    if(req.signedCookies.user){
        res.user = req.signedCookies.user
        next()
    }else{
        res.redirect('/')
    }
}