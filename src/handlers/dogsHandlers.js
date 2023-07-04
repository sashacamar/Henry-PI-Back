//Esto es para crear la ruta de la imagen por defecto
const path = require('path');

//Controllers
const {getAllDogs, getDogsByName, getDogById, createDog} = require('../controllers/dogsController')
const {getAllTemperaments} = require('../controllers/temperamentsControllers')
//-----Obtener Todos los perros o filtrarlos por nombre
const getDogsHandler = async(req,res)=>{
    const { name } = req.query;
    try {
        if (name){
            const allDogs = await getDogsByName(name);
            res.status(200).json(allDogs);
        }
        else {
            const allDogs = await getAllDogs();
            res.status(200).json(allDogs);
        }     
    } catch (error) {
        res.status(401).json({error: error.message})
    }
};

//-----Obtener Perros por id
const getDogHandler = async(req, res)=>{
    const { id } = req.params;
    try {
        const dog = await getDogById(id);
        //console.log(dog);
        res.status(200).json(dog)
    } catch (error) {
        res.status(401).json({error: error.message})
    }
};

//-----Crear una ruta para una imagen por defecto
const getDefaultImageHandler = (req, res)=>{
    try {
        const imagePath = path.join(__dirname, '../assets/dogDefault.png');
        res.status(200).sendFile(imagePath);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//-----Crear nuevos perros
const postDogHandler = async(req, res)=>{
    const { name, heightMin, heightMax, weightMin, weightMax, life_spanMin, life_spanMax, temperament } = req.body;

    try {
        await getAllTemperaments();
        const newDog = await createDog(name, heightMin, heightMax, weightMin, weightMax, life_spanMin, life_spanMax, temperament);
        res.status(201).json(newDog)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
};

module.exports = {getDogsHandler, getDogHandler, postDogHandler, getDefaultImageHandler}