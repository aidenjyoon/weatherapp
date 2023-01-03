import fs from "fs";
import path from "path";

const API_KEY = process.env.API_KEY;

// const connectSQL = async () => {
//   const mysql = require("mysql");
//   const connection = mysql.createConnection({
//     host: "137.25.13.199",
//     user: "u851317042_weatherApp",
//     password: "gBwz2wRLFi#pNTa",
//   });

//   connection.connect((error) => {
//     if (error) {
//       console.log("Error connecting to the MySQL Database");
//       return;
//     }
//     console.log("Connection established sucessfully");
//   });
//   connection.end((error) => {});
// };

const getFilePath = (purpose) => {
  if (purpose === "geocode") {
    return path.join(process.cwd(), "data", "geocode.json");
  } else if (purpose === "weather") {
    return path.json(process.cwd(), "data", "weather.json");
  }
};

const fetchGeocode = async (zipcode, country_code) => {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country_code}&appid=${API_KEY}`;

  const res = await fetch(url);
  const obj = await res.json();

  console.log(obj["lat"], obj["lon"]);

  return obj;
};

const fetch5day3hrForcast = async (lat, lon, units = "metric") => {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

  const res = await fetch(url);
  const obj = await res.json();

  console.log(obj);
  return obj;
};

const handler = async (req, res) => {
  const LIMIT = 1;

  if (req.method === "POST") {
    const zipcode = req.body.zipcode;
    const country_code = req.body.country_code;

    const geocode = await fetchGeocode(zipcode, country_code);

    // to read what exists
    const geocodeFilePath = getFilePath("geocode");
    const fileData = fs.readFileSync(geocodeFilePath);

    // === to save the previous geocode
    // let data = "";

    // if (fileData.toString() === "") {
    //   res.status(500).json({
    //     message:
    //       "check " + geocodeFilePath + ". It must be populated with an array to work.",
    //   });
    // } else {
    //   data = JSON.parse(fileData);
    // }

    // data.push(geocode);
    // fs.writeFileSync(geocodeFilePath, JSON.stringify(data));
    // ====

    if (geocode["message"] === "not found") {
      res.status(404).json({ message: "Invalid zipcode. Please check again." });
    }

    fs.writeFileSync(geocodeFilePath, JSON.stringify(geocode));

    const lat = geocode["lat"];
    const lon = geocode["lon"];

    const forcast5d3h = await fetch5day3hrForcast(lat, lon, "Imperial");

    // check for snow or rain volume for last 3 hours, mm
    const rainBool = forcast5d3h.hasOwnProperty("rain");
    const snowBool = forcast5d3h.hasOwnProperty("snow");

    const dateTime = forcast5d3h["list"][0]["dt"]; // unix timestamp
    let formattedTime = new Date(dateTime * 1000);
    formattedTime = formattedTime.toLocaleString();

    const local_offsetSec = new Date().getTimezoneOffset() * 60;
    const local_dateTime = new Date((dateTime - local_offsetSec) * 1000);

    const temp = forcast5d3h["list"][0]["main"]["temp"];
    const temp_feelsLike = forcast5d3h["list"][0]["main"]["feels_like"];

    res.status(200).json({
      message: "success!",
      geocode: geocode,
      forcast: forcast5d3h,
      temp: temp,
      time: formattedTime,
      local_offset: local_offsetSec,
    });
  }

  // url = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${state_code},${country_code}&limit=${LIMIT}&appid=$`{API_KEY}`;
};

export default handler;
