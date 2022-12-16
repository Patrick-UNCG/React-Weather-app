import React from "react"

function App() {
  const cityInput = document.getElementById("city-input")
  const [city, setCity] = React.useState("London")
  const [isError, setIsError] = React.useState(true)
  
  
  const [weatherData, setWeatherData] = React.useState()
  React.useEffect(() => {
    try{
      fetch(`http://api.weatherapi.com/v1/forecast.json?key=994482bebcfb44da93222215221412&q=${city}&days=10&aqi=no&alerts=no`)
        .then((res) =>{
          if(res.ok){
            return res.json()
          }
          else{
            throw new Error('Error getting weather data')
          }
        }).then((data) => {
          setWeatherData(data)
          setIsError(false)
        }).catch((error) => {
          setIsError(true)
        })
    }
    catch(error){
      console.log(error)
    }
  }, [city])

  function submit(e){
    e.preventDefault()
    setCity(cityInput.value)
  }

  function getForecastDay(date){
    const d = new Date(date)
    switch(d.getDay()){
      case 0:
        return "Monday"
      case 1:
        return "Tuesday"
      case 2:
        return "Wednesday"
      case 3:
        return "Thursday"
      case 4:
        return "Friday"
      case 5:
        return "Saturday"
      case 6:
        return "Sunday"
      default: return "Monday"
    }
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
          <input name="city" id="city-input" type="text" placeholder="Enter a city" required>
          </input>
        </form>
      <header className="App-header">
        {!isError ? 
        <div className="weather-data">
          <p className="city-name">{weatherData.location.name}</p>
          <div className="weather-data-current-temp-div">
            <img className='weather-icon' src= {weatherData.current.condition.icon} alt="current weather icon"/>
            <h1>{Math.round(weatherData.current.temp_f)}°F</h1>
          </div>
          <h2 className="weather-data-condition">{weatherData.current.condition.text}</h2>
          <div className="weather-data-sub-info">
            <p className="weather-data-min-max">Max: {Math.round(weatherData.forecast.forecastday[0].day.maxtemp_f)}°F</p>
            <p className="weather-data-min-max">Min: {Math.round(weatherData.forecast.forecastday[0].day.mintemp_f)}°F</p>
          </div>
          <div className="weather-data-sub-info2">
            <div >
              <h2>{Math.round(weatherData.current.feelslike_f)}°F</h2>
              <p className="weather-data-p">Feels like</p>
            </div>
            <div>
              <h2>{weatherData.current.humidity}%</h2>
              <p className="weather-data-p">Humidity</p>
            </div>
          </div>
          <div>
            <p>3 Day Forecast</p>
            <div className="forecast-div">
              {weatherData.forecast.forecastday.map((dayItem,index)=>{
                return <div className="forecast-item">
                <p key = {index} className="forecast-item-date">{getForecastDay(dayItem.date)}</p>
              </div>
              })}
            </div>
          </div>
        </div> 
        : <h1>...</h1>}
      </header>
      <footer className="footer">
        <a href="https://github.com/Patrick-UNCG/React-Weather-app" className='footer-link'><i id="github-link" className="fa-brands fa-github"></i></a>
      </footer>
    </div>
  );
}

export default App;
