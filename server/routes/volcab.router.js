const router = require("express").Router();
const volcabController = require('../controllers/volcab.c')

router.get('/',volcabController.get)

module.exports = router

