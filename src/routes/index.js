const { Router } = require('express');
const dogsRouter = require('./dogsRouter');
const temperamentRouter = require('./temperamentRouter');

const router = Router();

router.use('/dogs', dogsRouter);

router.use('/temperaments', temperamentRouter)

module.exports = router;
