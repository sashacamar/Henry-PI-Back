const { Router } = require('express');
const temperamentRouter = Router();

//handlers
const {getTemperamentsHandler} = require('../handlers/temperamentsHandlers')

temperamentRouter.get('/', getTemperamentsHandler)

module.exports = temperamentRouter;