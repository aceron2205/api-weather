const API_KEY = '324a22287642ff55d9c4f3fefef42d8c'
const cities = [
    'Atlanta',
    'Denver',
    'Seattle',
    'San Francisco',
    'Orlando',
    'New York',
    'Chicago',
    'Austin'
]

$(document).ready(function(){

    getWeatherByCityName('atlanta')

    $('#city-search').on('keypress', function (e) {
        if(e.which === 13){
            const cityName = $('#city-search').val();

            if(cityName.trim().length === 0) return

            getWeatherByCityName(cityName)
        }
  });

    cities.forEach(city => {
        const id = `${city.toLowerCase().split(' ').join('-')}-button`
        $("#sidebar").append(`
        <li>
            <button id="${id}" class="bg-gray-300 w-full rounded py-2 border-2 border-gray-500">${city}</button>
        </li>
        `);


        // add listener for when city button is clicked
        $(`#${id}`).click(() => getWeatherByCityName(city));
    })
});

function getWeatherByCityName(cityName) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast`,
        data: {
            q: cityName,
            zipcode: 97201,
            appid: API_KEY,
            units: 'metric'
        },
        success: function( result ) {
          fillWeatherInfo(result)
        },
        error: function() {
            alert('City not found :(')
        }
      });
}

function fillWeatherInfo(result) {
    const city = result.city
    const weatherList = result.list
    
    const iconcode = weatherList[0].weather[0].icon;
    const iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";


    $(`#city-name`).html(`
        <p class="flex">
            ${city.name} <img src="${iconurl}" />
        </p>
    `)
    $(`#current-temp`).text(weatherList[0].main.feels_like + '° C')
    $(`#current-wind`).text(weatherList[0].wind.speed + ' KM/H')
    $(`#current-hum`).text(weatherList[0].main.humidity)

    for(let i = 1; i <= 5; i ++) {
        const w = weatherList[i]
        const day = new Date(w.dt_txt)
        const date = `${day.getDay()}/${day.getUTCMonth()}/${day.getFullYear()}`
        const iconcode = w.weather[0].icon;
        const iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

        console.log(w)
        $(`#day-${i} > p.date`).text(date)
        $(`#day-${i} > div.icon > img`).attr('src', iconurl);
        $(`#day-${i} > p.temp`).text('Temp: ' + w.main.temp)
        $(`#day-${i} > p.wind`).text('Wind: ' + w.wind.speed + ' KM/H')
        $(`#day-${i} > p.hum`).text('Humidity: ' + w.main.humidity)
    }
}
