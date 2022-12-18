import React from "react"
import sunny from "./images/sunny.jpg"
import night from "./images/night.jpg"
import cloudyDay from "./images/cloudy.jpg"
import cloudyNight from "./images/cloudynight.webp"
import { motion } from "framer-motion"

function App() {
  const cityInput = document.getElementById("city-input")
  const [city, setCity] = React.useState("London")
  const [isError, setIsError] = React.useState(true)
  const [isDay, setIsDay] = React.useState(0)
  let background = night;
  
  
  const [weatherData, setWeatherData] = React.useState()
  React.useEffect(() => {
    try{
      fetch(`https://api.weatherapi.com/v1/forecast.json?key=994482bebcfb44da93222215221412&q=${city}&days=10&aqi=no&alerts=no`)
        .then((res) =>{
          if(res.ok){
            return res.json()
          }
          else{
            throw new Error('Error getting weather data')
          }
        }).then((data) => {
          setWeatherData(data)
          setIsDay(data.current.is_day)
          setIsError(false)
        }).catch((error) => {
          setIsError(true)
        })
    }
    catch(error){
      console.log(error)
    }
  }, [city])

  function getBackground(){
    console.log(weatherData.current.condition.code)
    const x = weatherData.current.condition.code
    switch(true){
      case (x < 1001): 
        if(isDay===0){
          background=night
          break
        }
        else{
          background=sunny
          break
        }
      case (x>=1003 && x <= 1030):
        if(isDay===0){
          background=cloudyNight
          break
        }
        else{
          background=cloudyDay
          break
        }
      default: background = sunny
    }
  }
  if(weatherData){
    getBackground()
  }

  function submit(e){
    e.preventDefault()
    setCity(cityInput.value)
    console.log(isDay)
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

  //linear-gradient(18deg, rgba(205,180,219,1) 0%, rgba(255,175,204,1) 39%, rgba(162,210,255,1) 67%) no-repeat center center fixed
  //isDay === 0 ? `url(${night})` : `url(${sunny})`
  //<footer className="footer"><a href="https://github.com/Patrick-UNCG/React-Weather-app" className='footer-link'><i id="github-link" className="fa-brands fa-github"></i></a></footer>

  return (
    <div className="App" style={{backgroundImage: `url(${background})`, backgroundSize:"cover"}}>
      <motion.form
       initial={{ opacity: 0, y: -500 }}
       animate={{ opacity: 1, y: 0 }}
       onSubmit={submit}>
          <input name="city" id="city-input" type="text" placeholder="Enter a city" required>
          </input>
        </motion.form>
      <motion.header
      initial={{ opacity: 0, y: -500 }}
      animate={{ opacity: 1, y: 0 }}
       className="App-header">
        {!isError ? 
        <div className="weather-data">
          <p className="city-name">{weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}</p>
          <div className="weather-data-current-temp-div">
            <img className='weather-icon' src= {weatherData.current.condition.icon} alt="current weather icon"/>
            <h1 className='weather-temp'>{Math.round(weatherData.current.temp_f)}°F</h1>
          </div>
          <h2 className="weather-data-condition">{weatherData.current.condition.text}</h2>
          <div className="weather-data-sub-info">
            <p className="weather-data-min-max">Max: {Math.round(weatherData.forecast.forecastday[0].day.maxtemp_f)}°F</p>
            <p className="weather-data-min-max">Min: {Math.round(weatherData.forecast.forecastday[0].day.mintemp_f)}°F</p>
          </div>
          <div className="weather-data-sub-info2">
            <div >
              <h1>{Math.round(weatherData.current.feelslike_f)}°F</h1>
              <p className="weather-data-p">Feels like</p>
            </div>
            <div>
              <h1>{weatherData.current.humidity}%</h1>
              <p className="weather-data-p">Humidity</p>
            </div>
          </div>
          <div>
            <p className="forecast-title">3 Day Forecast</p>
            <div className="forecast-div">
              {weatherData.forecast.forecastday.map((dayItem,index)=>{
                return <div className="forecast-item">
                <p className="forecast-item-date">{getForecastDay(dayItem.date)}</p>
                <img className='forecast-item-icon' src= {dayItem.day.condition.icon} alt="current weather icon"/>
                <p className="forecast-item-temp">{Math.round(dayItem.day.avgtemp_f)}°F</p>
                <p className="forecast-item-temp">{dayItem.day.condition.text}</p>
              </div>
              })}
            </div>
          </div>
        </div> 
        : <h1>...</h1>}
      </motion.header>
      
    </div>
  );
}

export default App;
