const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || []; 


document.addEventListener('DOMContentLoaded', updateFavoriteCities);

document.getElementById('add-favorite').addEventListener('click', function () {
    const cityName = document.getElementById('cityName').textContent;
    const temperature = document.getElementById('temperature').textContent;
    const weatherDescription = document.getElementById('weatherDescription').textContent;
    const humidity = document.getElementById('humidity').textContent;
    const windSpeed = document.getElementById('windSpeed').textContent;

    const data = {
        name: cityName,
        temp: temperature,
        weatherDesc: weatherDescription,
        humi: humidity,
        windSp: windSpeed,
    };

    
    const alreadyFavorite = favoriteCities.some(city => city.name === cityName);

    if (!alreadyFavorite) {
        favoriteCities.push(data); 
        saveToLocalStorage();
        updateFavoriteCities(); 
    } else {
        alert("Этот город уже добавлен в избранное!");
    }
});

function updateFavoriteCities() {
    const favoriteList = document.getElementById("favorite-list");
    favoriteList.innerHTML = ""; 

    favoriteCities.forEach((city) => {
        const listItem = document.createElement("div");
        listItem.classList.add("fav-city");

        
        listItem.innerHTML = `
            <h4>${city.name}</h4>
            <p>Temp: ${city.temp}</p>
            <p>Description: ${city.weatherDesc}</p>
            <p>Humidity: ${city.humi}</p>
            <p>Wind speed: ${city.windSp}</p>
        `;

        
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => {
            const index = favoriteCities.indexOf(city);
            if (index > -1) {
                favoriteCities.splice(index, 1);
                saveToLocalStorage(); 
                updateFavoriteCities();
            }
        });

        listItem.appendChild(removeBtn); 
        favoriteList.appendChild(listItem); 
    });
}

function saveToLocalStorage() {
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
}










document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault(); 
    const city = document.getElementById('text').value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=954ac284fe0a679306f807ca7f090b38`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('weatherDescription').textContent = `Weather: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

            document.getElementById('weatherCard').style.display = 'block';

            checkWeatherAlerts(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('City not found!');
        });
});

function defaultCity () {
    const cities = ['Taraz', 'Almaty', 'Astana'];

    cities.forEach(city => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=954ac284fe0a679306f807ca7f090b38`)
        .then(response => response.json())
        .then(data => {
            document.getElementById(`city-name-${city.toLowerCase()}`).textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById(`Temp-${city.toLowerCase()}`).textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById(`Weather-${city.toLowerCase()}`).textContent = `Weather: ${data.weather[0].description}`;
            document.getElementById(`Humidity-${city.toLowerCase()}`).textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById(`Wind-${city.toLowerCase()}`).textContent = `Wind Speed: ${data.wind.speed} m/s`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('City not found!');
        });
    });
}

function toggleNav() {
    const nav = document.getElementById('headerNav');
    // const toggle = document.getElementById('header-tog');
    // toggle.textContent = "x";
    nav.classList.toggle('show');
}

function checkWeatherAlerts(data) {
    if (data.wind.speed > 1) { // > 10.
        sendNotification("⚠️ Warning: Strong wind detected. Be cautious!");
    } else if (data.weather[0].main === "Thunderstorm") {
        sendNotification("⚡ Thunderstorm alert! Stay indoors!");
    } 
}


function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=954ac284fe0a679306f807ca7f090b38`)
                    .then(response => response.json())
                    .then(data => {
                        displayWeather(data, 'locationWeather'); 
                    })
                    .catch(error => console.error('Error fetching location weather:', error));
            },
            error => alert("Unable to retrieve your location!")
        );
    } else {
        alert("Geolocation is not supported by your browser.");
        console.log("Error about geolocation");
    }
}

function displayWeather(data, elementId) {
    const weatherElement = document.getElementById(elementId);
    weatherElement.innerHTML = `
        <h4>${data.name}, ${data.sys.country}</h4>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function sendNotification(text) {
    if (Notification.permission === "granted") {
        new Notification("Notifaction about weather", {
            body: text,
            icon: "danger.png", 
        });
    } else {
        alert("No notifications!");
    }
}

getWeatherByLocation();



defaultCity();

