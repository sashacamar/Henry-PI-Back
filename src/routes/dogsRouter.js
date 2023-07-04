const { Router } = require('express');
const dogsRouter = Router();

//handlers
const {getDogsHandler, getDogHandler, postDogHandler, getDefaultImageHandler} = require('../handlers/dogsHandlers')

dogsRouter.get('/default-image', getDefaultImageHandler);

dogsRouter.get('/', getDogsHandler);

dogsRouter.get('/:id', getDogHandler);

dogsRouter.post('/', postDogHandler);

module.exports = dogsRouter;