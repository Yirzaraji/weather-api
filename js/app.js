const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const list = document.querySelector(".cities");
const msg = document.querySelector(".top-banner .msg");

//test localStorage
localStorage.setItem('categorie', 'hack');
var cat = localStorage.getItem('categorie');
//localStorage.removeItem('categorie');
console.log(cat)
console.log(navigator.geolocation)
var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

form.addEventListener("submit", e => 
{
    e.preventDefault();
    const inputVal = input.value;
    console.log(inputVal)
    msg.textContent = "";
    form.reset();
    input.focus();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const { main, name, sys, weather } = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
            const li = document.createElement("li");
            li.classList.add("city");
            const markup = `
            <h3 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h3>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
            </div>
            <figure>
                <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                <figcaption>${weather[0]["description"]}</figcaption>
            </figure>
            `;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Please search for a valid city 😩";
        });

});



    