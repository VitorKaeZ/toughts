module.exports.checkAuth = function(req, res, next) {

    const userId =  req.session.userid

    if(!userId) {
        req.flash('message', 'Você precisa estar logado para fazer isso!')
        res.redirect('/login')
    }

    next()
}