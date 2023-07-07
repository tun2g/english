const router = require("express").Router();
const volcabController = require('../controllers/volcab.c')

router.post('/create',volcabController.addNew)

router.get('/get/:user',volcabController.getVolByUser)

router.put('/update/:user',volcabController.update)

router.get('/get-all',volcabController.getAll)


module.exports = router

