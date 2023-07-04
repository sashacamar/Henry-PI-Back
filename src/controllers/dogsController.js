const { Dog, Temperament } = require('../db');
const axios = require('axios');
//Requiero de Op para cuando quiero buscar en la DDBB 
//las razas que coincidan con el nombre
const { Op } = require("sequelize");
// Datos de la API
const { URL_API, URL_API_IMG , API_KEY } = process.env;


// funcion para recoger la info quiero obtener la API
const infoMap = (dogsRow, image)=> 
    dogsRow.map( dog=>{
        const height = dog.height.metric.split(' - ');
        const weight = dog.weight.metric.split(' - ');
        const life_span = dog.life_span.match(/\d+/g);
        let temperaments = [];
        if (dog.temperament) temperaments = dog.temperament.split(', ')

        return{
        id : dog.id,
        image : !!image ? image : dog.image.url,
        name: dog.name,
        heightMin: height[0] ? Number(height[0]) : null,
        heightMax: height[1] ? Number(height[1]) : null,
        weightMin: weight[0] ? Number(weight[0]) : null,
        weightMax: weight[1] ? Number(weight[1]) : null,
        life_spanMin: life_span[0] ? Number(life_span[0]) : null,
        life_spanMax: life_span[1] ? Number(life_span[1]) : null,
        temperaments: temperaments,
        created: false
        }
    })

// funcion enviar los temperamentos de los perros de la DDBB en un array
const infoDDBBMap = (dogsRow)=> dogsRow.map(({id,image,name,heightMin,heightMax, weightMin, weightMax, life_spanMin,life_spanMax,Temperaments, created})=>{
    const temperaments = [];
    for (const temperament of Temperaments) {temperaments.push(temperament.name)}
    return{
        id,image,name,heightMin,heightMax, weightMin, weightMax,life_spanMin,life_spanMax, created,
        temperaments: temperaments
    }
})

// funcion para filtrar por nombre desde la API
const nameFilter = (dogsRow, name)=> 
dogsRow.filter(dog=> dog.name.toLowerCase().includes(name.toLowerCase()))

// funcion para obtener la URL de la imagen de una raza obtenida por id, imagen llega por referencia
const searchImage = async(dog)=> 
(await axios(URL_API_IMG + dog.reference_image_id, {
    headers: {"x-api-key": API_KEY}
})).data;

//Funcion para asociar los temperamentos recogidos por body al crear un nuevo perro
const associateTemperament = async(dog, temperaments)=>{
    console.log(temperaments);
    for (const temperament of temperaments) {
        const temp = await Temperament.findOne({where:{name: temperament}});
        temp && dog.addTemperament(temp.get('id'))
    }
}

// funcion para recoger la info de la API
const getDogsAPI = async(key, id, name)=>{
    const dogsAPIRow = key === 'id'
    ? [(await axios.get(`${URL_API}${id}`, {
        headers: {"x-api-key": API_KEY}
        })).data]
    : (await axios.get(URL_API, {
        headers: {"x-api-key": API_KEY}
    })).data
    //filtro los atributos que necesito de la API
    switch (key) {
        case 'id':
            const {url} = await searchImage(dogsAPIRow[0])
            return (infoMap(dogsAPIRow, url))[0]
        case 'name':
            return infoMap(nameFilter(dogsAPIRow, name));
        default:
            return infoMap(dogsAPIRow);
    }
}

// funcion para recoger la info de la DDBB
const getDogsDDBB = async(key, id, name)=>{
    switch (key) {
        case 'id': {
            const dog = await Dog.findByPk(id, {
                include: {
                    model: Temperament,
                    attributes: ['name'],
                    through: { attributes: [] },
                }
            })
            return (infoDDBBMap([dog]))[0]
        }
        case 'name': {
            const dogs = await Dog.findAll({
                where: { name: { [Op.iLike]: `%${name}%`} },
                include: {
                    model: Temperament,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            })   
            return infoDDBBMap(dogs)             
        }
        default: {
            const dogs = await Dog.findAll({
                include: {
                    model: Temperament,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            })
            return infoDDBBMap(dogs)
        }
    }
}

//---------------------------Funciones del Controller---------------------------

//---------Buscar todos los perros
const getAllDogs = async()=>{
    const dogsAPI = await getDogsAPI();
    const dogsDDBB = await getDogsDDBB();
    return [...dogsDDBB, ...dogsAPI]
}

//--------Buscar por coincidencia en el nombre
const getDogsByName = async(name)=>{
    const dogsAPI = await getDogsAPI('name', null, name)
    const dogsDDBB = await getDogsDDBB('name', null, name)
    return [...dogsDDBB, ...dogsAPI]
}

//---------Buscar Razas por ID
const getDogById = async(dogID)=>{
    const source = isNaN(Number(dogID)) ? 'DDBB' : 'API';
    if(source === 'API') return await getDogsAPI('id', dogID)
    if(source === "DDBB") return await getDogsDDBB('id', dogID)
}

//--------Agregar una nueva raza a la DDBB
const createDog = async(name, heightMin, heightMax, weightMin, weightMax, life_spanMin, life_spanMax, temperaments)=>{
    const newDog = await Dog.create({name, heightMin, heightMax, weightMin, weightMax, life_spanMin, life_spanMax});
    await associateTemperament(newDog, temperaments);
    return newDog;
}


module.exports = {getAllDogs, getDogsByName, getDogById, createDog}