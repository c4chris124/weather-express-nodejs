const fs = require('fs')
const axios = require('axios')


class Searches {

    history = []
    dbPath = './db/database.json'

    constructor() {
        // read DB if exist
        this.readDB()
    }

    get capitalizedHistory(){
        return this.history.map( place => {
            let words = place.split(' ')
            words = words.map(word => word[0].toUpperCase() + word.substring(1))
            return words.join(' ')
            // return words
        })
    }

    get paramsMapbox() {
        return {
            'limit': 5,
            'language': 'en',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric'
        }
    }

    async city(place = '') {
        try {
            // http request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            })

            const res = await instance.get();
            return res.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))

        } catch (error) {
            console.log('We did not find anything');
            return []
        }
    }

    async weatherPlace(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            })

            const res = await instance.get()
            const {weather, main} = res.data
            // wether attribute is an array with an object nested, we will have to access position one([0]), was returning undefined
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    addHistory(place = ''){
        if(this.history.includes(place.toLocaleLowerCase())){
            return
        }
        // prevent duplicates
        this.history.unshift(place.toLocaleLowerCase())

        // save in DB
        this.saveDB()
    }

    saveDB(){

        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB(){
        // if exist
        if(!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse(info)
        this.history = data.history
    }

}

module.exports = Searches;