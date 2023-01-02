const getGeocoding = async (city_name, state_code, country_code, zip_code) => {
  const limit = 1;
  let url = "";
  let zip_url = "";

  if (country_code === "US") {
    if (zip_code === undefined) {
      url = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${state_code},${country_code}&limit=${limit}&appid=${API_KEY}`;
    } else if (city_name === undefined || state_code === undefined) {
      zip_url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip_code},${country_code}&appid=${API_KEY}`;
    }
  } else {
    if (zip_code === undefined) {
      url = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${country_code}&limit=${limit}&appid=${API_KEY}`;
    } else if (city_name === undefined || state_code === undefined) {
      zip_url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip_code},${country_code}&appid=${API_KEY}`;
    }
  }
  const response = await fetch(url);
  const jsonData = await response.json();

  const categories = [];
  for (const key in jsonData) {
    categories.push({
      id: key,
      ...jsonData[key],
    });
  }
  // console.log("URL: ", url);
  // console.log("ZIP URL: ", zip_url);

  // console.log(categories[0]["lat"]);
  // console.log(categories[0]);

  return categories;
};

const getForcast = async () => {
  const url = `http://api.openweathermap.org/data/3.0/forecast?id=524901&appid=${API_KEY}`;

  const response = await fetch(url);
  const jsonData = await response.json();

  const categories = [];
  for (const key in jsonData) {
    categories.push({
      id: key,
      ...jsonData[key],
    });
  }

  console.log(categories);
};

export { getGeocoding, getForcast };
