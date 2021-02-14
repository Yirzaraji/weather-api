const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const list = document.querySelector(".cities");
const msg = document.querySelector(".top-banner .msg");
const clearStorage = document.getElementById("clearStorage");
console.log(clearStorage);

//Is loaded after the above code
window.onload = (event) => {
  const stringCitiesData = localStorage.getItem("citiesData");

  if (stringCitiesData === null) {
    return;
  }

  clearStorage.style.display = "inline-block";

  const citiesData = JSON.parse(stringCitiesData);
  console.log({ citiesData });

  for (const cityData of citiesData) {
    renderWeatherCard(cityData);
  }

  clearStoredData();
};

const renderWeatherCard = (cityData) => {
  const { main, name, sys, weatherIcon, weatherMain } = cityData;

  const li = document.createElement("li");
  li.classList.add("city");

  const icon = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  li.innerHTML = `
    <h3 class="city-name" data-name="${name},${sys}">
      <span>${name}</span>
      <sup>${sys}</sup>
    </h3>
    <div class="city-temp">${main}<sup>°C</sup></div>
    <figure>
      <img class="city-icon" src=${icon} alt=${weatherMain}>
      <figcaption>${weatherMain}</figcaption>
    </figure>
  `;

  list.appendChild(li);
};

const clearStoredData = () => {
  clearStorage.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputVal = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((dataApi) => {
      const { main, name, sys, weather } = dataApi;

      clearStorage.style.display = "inline-block";

      const cityData = {
        main: Math.round(main.temp),
        name: name,
        sys: sys.country,
        weatherIcon: weather[0]["icon"],
        weatherMain: weather[0]["main"],
      };

      const stringCitiesData = localStorage.getItem("citiesData");
      if (stringCitiesData === null) {
        localStorage.setItem("citiesData", JSON.stringify([cityData]));
      } else {
        const citiesData = JSON.parse(stringCitiesData);
        const citiesDataWithNewCity = citiesData.concat(cityData);
        localStorage.setItem(
          "citiesData",
          JSON.stringify(citiesDataWithNewCity)
        );
      }

      renderWeatherCard(cityData);

      form.reset();
    })
    .catch((error) => {
      console.error(error);
      msg.textContent = "Wrong city name 😩";
    });
});
