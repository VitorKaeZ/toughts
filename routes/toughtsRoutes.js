const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/toughts/add', checkAuth, ToughtController.createTought)
router.post('/toughts/add', checkAuth, ToughtController.createToughtSave)
router.get('/toughts/edit/:id', checkAuth, ToughtController.updateTought)
router.post('/toughts/edit/', checkAuth, ToughtController.updateToughtSave)
router.get('/toughts/dashboard', checkAuth, ToughtController.dashboard)
router.post('/toughts/remove', checkAuth, ToughtController.removeTought)
router.get('/home', ToughtController.showToughts)
router.post('/toughts/like', checkAuth,ToughtController.like)
router.get('/', ToughtController.homePage)

module.exports = router