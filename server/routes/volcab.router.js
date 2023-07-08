const router = require("express").Router();
const volcabController = require('../controllers/volcab.c')

router.post('/create',volcabController.addNew)

router.get('/get/:user',volcabController.getVolByUser)

router.put('/update/:user',volcabController.update)

router.delete('/delete',volcabController.deleteByUser)

router.get('/get-all',volcabController.getAll)

router.get('/get-pag',volcabController.getPagination)

router.get('/get-random',volcabController.getRandomVolcabs)

router.get('/get-query',volcabController.getListByQuery)


module.exports = router

