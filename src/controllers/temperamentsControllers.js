const { Temperament } = require('../db');
const axios = require('axios');

// Datos de la API
const { URL_API, API_KEY } = process.env;

//Crear una lista de temperamentos con todos los que existen en la API
const getAllTemperaments = async()=>{
    const dogsRow = (await axios.get(URL_API, {
        headers: {"x-api-key": API_KEY}
    })).data;

    let temperaments = []
    let indexRow = 0;
    while(indexRow < dogsRow.length){
        if(dogsRow[indexRow].temperament){
            const temperamentsRow = (dogsRow[indexRow].temperament).split(', ');
            for (const temperament of temperamentsRow) {
                !temperaments.includes(temperament) && temperaments.push(temperament)
            }
        }
        indexRow++;
    }
    indexRow = 0;
    while(indexRow < temperaments.length){
        await Temperament.create({name: temperaments[indexRow]})
        indexRow++;
    }
    return temperaments //hay 124 temperamentos en la API
}

module.exports = {getAllTemperaments}