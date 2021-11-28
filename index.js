const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");
require('dotenv').config()

// console.log(process.env);

const main = async () => {
    const searches = new Searches()

    let opt;

    do{
        opt = await inquirerMenu();


        switch (opt) {
            case 1:
                // show message
                const term = await readInput('City:');

                // search places
                const places = await searches.city(term)
                
                // select places
                const selectedID = await listPlaces(places)
                if(selectedID === '0') continue;

                const selectedPlace = places.find(l => l.id === selectedID)
                // save in DB
                searches.addHistory(selectedPlace.name)

                // console.log({selectedID});
  
                const {id, name, lng, lat} = selectedPlace

                // weather
                const weather = await searches.weatherPlace(selectedPlace.lat, selectedPlace.lng)
                // console.log(weather);
                // show results
                console.log('\nInformation of the city\n'.green)
                console.log('City:', name)
                console.log('Lat:', lat)
                console.log('Long:', lng)
                console.log('Temperature:', weather.temp)
                console.log('Lower:', weather.min)
                console.log('Highest:', weather.max)
                console.log('Weather:', weather.desc.yellow );
                break;
            case 2: 
                searches.capitalizedHistory.forEach((p, i) => {
                    const idx = `${i + 1}.`.yellow
                    console.log(`${idx} ${p}`);
                })
                break;
        }

        // 79 8:00

        (opt !== 0) && await pause() 

    } while (opt !== 0) 
    
}
main()
