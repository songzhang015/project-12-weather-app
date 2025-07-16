import "./styles.css";
import bgImage from "./bg.jpg";

async function getData(location) {
	const apiKey = "YRD233UF5RTTR8VKALG4RJMYV";
	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const json = await response.json();
		return json;
	} catch (error) {
		console.error(error.message);
	}
}

function processData(json) {
	if (!json || !json.resolvedAddress) {
		throw new Error("Invalid or incomplete API response");
	}
	const data = {
		location: json.resolvedAddress.replace(", United States", ""),
		condition: json.currentConditions.conditions,
		tempF: Math.round(json.currentConditions.temp),
		tempC: Math.round((json.currentConditions.temp - 32) * (5 / 9)),
		tempMinF: Math.round(json.days[0].tempmin),
		tempMaxF: Math.round(json.days[0].tempmax),
		tempMinC: Math.round((json.days[0].tempmin - 32) * (5 / 9)),
		tempMaxC: Math.round((json.days[0].tempmax - 32) * (5 / 9)),
		feelsLikeF: Math.round(json.currentConditions.feelslike),
		feelsLikeC: Math.round((json.currentConditions.feelslike - 32) * (5 / 9)),
		windSpeed: json.currentConditions.windspeed,
		humidity: Math.round(json.currentConditions.humidity),
		time: new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			timeZone: json.timezone,
		}),
	};
	return data;
}

function displayData(data) {
	const units = "F";
	console.log(data);
	const mainContainer = document.createElement("div");
	mainContainer.classList.add("main-container");
	//
	const leftContainer = document.createElement("div");
	leftContainer.classList.add("left-container");

	const highLowContainer = document.createElement("div");
	highLowContainer.classList.add("high-low-container");

	const locationText = document.createElement("h2");
	locationText.classList.add("location-text");
	const tempText = document.createElement("h1");
	const highText = document.createElement("h4");
	const lowText = document.createElement("h4");

	locationText.textContent = data.location;
	tempText.textContent = `${units === "F" ? data.tempF : data.tempC}°`;
	highText.textContent = `H: ${units === "F" ? data.tempMaxF : data.tempMaxC}°`;
	lowText.textContent = `L: ${units === "F" ? data.tempMinF : data.tempMinC}°`;

	highLowContainer.appendChild(highText);
	highLowContainer.appendChild(lowText);
	leftContainer.appendChild(locationText);
	leftContainer.appendChild(tempText);
	leftContainer.appendChild(highLowContainer);
	//
	const rightContainer = document.createElement("div");
	rightContainer.classList.add("right-container");

	const todayText = document.createElement("h4");
	const timeText = document.createElement("h4");
	const conditionText = document.createElement("h4");

	todayText.textContent = "Today";
	timeText.textContent = data.time;
	conditionText.textContent = data.condition;

	rightContainer.appendChild(todayText);
	rightContainer.appendChild(timeText);
	rightContainer.appendChild(conditionText);
	//
	const bottomContainer = document.createElement("div");
	bottomContainer.classList.add("bottom-container");

	const feelsLikeContainer = document.createElement("div");
	const windContainer = document.createElement("div");
	const humidityContainer = document.createElement("div");
	feelsLikeContainer.classList.add("bottom-element");
	windContainer.classList.add("bottom-element");
	humidityContainer.classList.add("bottom-element");

	const feelsLikeTop = document.createElement("h5");
	const windTop = document.createElement("h5");
	const humidityTop = document.createElement("h5");

	const feelsLikeBottom = document.createElement("h6");
	const windBottom = document.createElement("h6");
	const humidityBottom = document.createElement("h6");

	feelsLikeTop.textContent = `${
		units === "F" ? data.feelsLikeF : data.feelsLikeC
	}°`;
	windTop.textContent = `${data.windSpeed} mph`;
	humidityTop.textContent = `${data.humidity}%`;

	feelsLikeBottom.textContent = "Feels Like";
	windBottom.textContent = "Wind";
	humidityBottom.textContent = "Humidity";

	feelsLikeContainer.appendChild(feelsLikeTop);
	feelsLikeContainer.appendChild(feelsLikeBottom);
	windContainer.appendChild(windTop);
	windContainer.appendChild(windBottom);
	humidityContainer.appendChild(humidityTop);
	humidityContainer.appendChild(humidityBottom);

	bottomContainer.appendChild(feelsLikeContainer);
	bottomContainer.appendChild(windContainer);
	bottomContainer.appendChild(humidityContainer);
	//
	mainContainer.appendChild(leftContainer);
	mainContainer.appendChild(rightContainer);
	mainContainer.appendChild(bottomContainer);
	document.body.appendChild(mainContainer);
}

function initOverlay() {
	const overlay = document.createElement("div");
	overlay.style.position = "fixed";
	overlay.style.width = "100vw";
	overlay.style.height = "100vh";
	overlay.style.backgroundImage = `url(${bgImage})`;
	overlay.style.backgroundSize = "cover";
	overlay.style.backgroundPosition = "center";
	overlay.style.opacity = "0.75";
	overlay.style.zIndex = "-1";
	document.body.appendChild(overlay);
}

function initSearch() {
	const searchContainer = document.createElement("div");
	searchContainer.classList.add("search-container");

	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.classList.add("search-input");
	searchInput.placeholder = "Search location";

	const searchButton = document.createElement("button");
	searchButton.classList.add("search-button");
	searchButton.textContent = "Search";

	searchContainer.append(searchInput);
	searchContainer.append(searchButton);
	document.body.append(searchContainer);

	const btn = document.querySelector(".search-button");
	const queryElement = document.querySelector(".search-input");

	btn.addEventListener("click", () => {
		if (queryElement.value) {
			init(queryElement.value);
		}
	});
}

function displayError() {
	if (document.querySelector(".error-message")) return;

	const errorElement = document.createElement("div");
	errorElement.classList.add("error-message");
	errorElement.textContent = "Location not found!";
	document.body.appendChild(errorElement);
}

async function init(location = "Portland, Oregon") {
	let json;
	try {
		json = await getData(location);
		if (!json || !json.resolvedAddress) {
			throw new Error("Invalid weather data");
		}
	} catch (error) {
		displayError();
		return;
	}

	document.body.innerHTML = "";
	initOverlay();
	const data = processData(json);
	displayData(data);
	initSearch();
}

document.addEventListener("DOMContentLoaded", () => init());
