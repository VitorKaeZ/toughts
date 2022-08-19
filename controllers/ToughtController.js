const Tought = require('../models/Tought')
const User = require('../models/User')
const Likes = require('../models/Likes')

const { Op } = require('sequelize')

module.exports = class ToughtController {
    static homePage(req, res) {
        res.redirect("/home")
    }

    
    static async showToughts(req, res) {
        
        let search = ''
        
        if (req.query.search) {
            search = req.query.search
        }
        
        let order = 'DESC'
        let column = 'createdAt'

        if(req.query.order === 'old') {
            order = 'ASC'
        }else if(req.query.order === 'new') {
            order = 'DESC'
        }else if(req.query.order === 'unlike') {
            order = 'ASC'
        }else if(req.query.order === 'like') {
            order = 'DESC'
        }
        
        if(req.query.like === 'like') {
            column = 'likes'
        }else{
            column = 'createdAt'
        }


        const toughtsData = await Tought.findAll({
            include: User,
            
            where: {
                title: {[Op.like]: `%${search}%`},
            },
            order: [[column, order]]
        })
        
        const toughts = toughtsData.map((result) => result.get({ plain: true }))
        
        
        let toughtsQty = toughts.length

    
        if(toughtsQty === 0) {
            toughtsQty = false
        }

        if (req.session.userid === undefined ){
            console.log("ate aqi")
            return res.render('toughts/home', { toughts, search, toughtsQty})
        }
        

        let liked
        let likedTought = async (element, index, array) => {
            const likesData = await Likes.findOne({ where: { ToughtId: element.id , UserId: req.session.userid } })
            if (likesData === null) {
                liked = false
            } else {
                liked = true
            }           
            console.log(liked)
            element.liked = liked
            console.log(element)
        }

        toughts.forEach(likedTought)


        console.log(toughts)

        
        res.render('toughts/home', { toughts, search, toughtsQty})
    }
    
    
    static async dashboard(req, res) {
        const userId = req.session.userid
        
        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Tought,
            plain: true,
        })
        //check if user exists
        if (!user) {
            res.redirect('/login')
        }

        const toughts = user.Toughts.map((result) => result.dataValues)

        console.log(toughts.id)

        let emptyToughts = false

        if(toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts})
    }
    static createTought(req, res) {
        res.render('toughts/create')
    }
    static async createToughtSave(req, res) {
        
        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
            likes: []
        }

       try {

            await Tought.create(tought)

            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

       } catch (error) {
            console.log(error)
       }
    }

    static async removeTought(req, res) {

        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Tought.destroy({ where: {id: id, UserId: UserId} })

            req.flash('message', 'Pensamento removido com sucesso')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um erro: '+ error)
        }
    }

    static async updateTought(req, res) {

        const id = req.params.id

        const tought = await Tought.findOne({ where: { id: id }, raw: true })

        res.render('toughts/edit', { tought })
    }
    static async updateToughtSave(req, res) {

        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        try {
            await Tought.update(tought, { where: { id: id } })

            req.flash('message', 'Pensamento atualizado com sucesso')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }


    static async like(req, res) {

        const id = req.body.id
        const userId = req.session.userid
        const tought = await Tought.findByPk(id)

        if(!userId) {
            return res
        }

        if(!tought){
            return res
            
        }

        let like = await Likes.findOne({
            where: {[Op.and]: [
                 { ToughtId : id },
                 { UserId : userId }
                ]}
        })

        
        
        
        if(!like) {
            await Likes.create({
                UserId: userId,
                ToughtId: id,
            })

            let likesTought = await Likes.findAll({ where: { ToughtId : id, } })

            let likes = {
                likes: likesTought.length ++
            }

            await Tought.update(likes, { where: { id: id } })
        } else {

            await like.destroy() 

            let likes

            let likesTought = await Likes.findAll({ where: { ToughtId : id, } })

            if (likesTought.length === 0) {
                likes = {
                    likes: 0 
            }
            } else {
                 likes = {
                    likes: likesTought.length -- 
                }
            }        
            

            await Tought.update(likes, { where: { id: id } })      
        }
       
    
        
        return res.redirect('/home')

    }
}