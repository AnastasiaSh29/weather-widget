document.querySelector("#search").onchange = searchWeather;
const param = {
  url: "https://api.openweathermap.org/data/2.5/",
  apiKey: "e5f6e21dfecc787e9f3fb603939a96aa",
};

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let { latitude, longitude } = position.coords;

      fetch(
        `${param.url}forecast?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${param.apiKey}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          showWeather(data);
        });
    });
  }
});

function showWeather(data) {
  console.log("###showWeather", data);
  const widget = document.querySelector(".widget"),
    label = document.querySelector(".search__label");

  let today = document.createElement("div");
  today.className = "today";

  document.querySelector(".date-today").innerHTML = "";

  fetch(
    `${param.url}forecast?q=${data.city.name}&units=metric&appid=${param.apiKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      daysForecast(forecast);

      document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${data.city.name},wallpaper,landscape')`;
      console.log(document.body.style.backgroundImage);
      widget.classList.remove("loading");

      today.innerHTML = `
    
                    <div class="today__wrap">
                    
                        <div class="today__temp">${Math.round(
                          forecast.list[0].main.temp
                        )}&deg;C</div>
                        <div class="today__feels-like">Feels like ${Math.round(
                          forecast.list[0].main.feels_like
                        )}&deg;C</div>
                        
                    </div>
                    <div class="today__wrap">
                        <div class="today__city">${forecast.city.name}, ${
        forecast.city.country
      }</div>
                        <div class="today__weather">${
                          forecast.list[0].weather[0].description
                        }</div>
                    
                    </div>
                    <div class="today__wrap">
                        <div class="today__icon"><img class="icon" alt="${
                          forecast.list[0].weather[0].description
                        }" src="https://openweathermap.org/img/wn/${
        forecast.list[0].weather[0]["icon"]
      }.png"></div>
                        
                    </div>       
                `;
      document.querySelector(".date-today").appendChild(today);
    });
}

function daysForecast(data) {
  document.querySelector(".days__list").innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(data.list[i].dt * 1000);
    const day = date.getDay();

    let li = document.createElement("li");

    li.innerHTML = `
                <div class="item">
                    <p class="item__day">${week[day]}</p>
                    <div class="item__icon"><img class="icon" alt="" src="https://openweathermap.org/img/wn/${
                      data.list[i].weather[0]["icon"]
                    }.png"></div>
                    <p class="item__weather">${
                      data.list[i].weather[0].description
                    }</p>
                    <div class="item__dayMinMin">
                        <p class="item__dayMin" id="day1Min">${Math.floor(
                          data.list[i].main.temp_min
                        )}&deg;C</p>
                        <p class="item__dayMax" id="day1Max">${Math.floor(
                          data.list[i].main.temp_max
                        )}&deg;C</p>
                    </div>
                </div>
        `;
    document.querySelector(".days__list").appendChild(li);
  }
}

function searchWeather() {
  const city = document.querySelector("#search").value;
  console.log(city);

  fetch(`${param.url}forecast?q=${city}&units=metric&appid=${param.apiKey}`)
    .then((res) => {
      if (!res.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      showWeather(data);
    });
}
