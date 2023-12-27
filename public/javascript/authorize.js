function authorize(req, res, next){
    if(req.signedCookies['admin']){
        next()
    }else{
        res.redirect('/')
    }
}

module.exports = authorize