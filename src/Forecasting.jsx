import { ICONS_URLS } from "./icons";

const Forecasting = ({ forecastData }) => {
  return (
    <section>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "1rem",
        }}
        className="container"
      >
        Forecasts
      </div>
      <div className="container forecast__container">
        {forecastData &&
          forecastData.map((forecast) => (
            <article className="forcast" key={forecast.dt}>
              <div>
                <img src={ICONS_URLS[forecast?.weather[0]?.icon]} alt="" />
                <h2>
                  {new Date(forecast.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </h2>
              </div>
              <div>
                <h3>{forecast.weather[0].description}</h3>
                <small>
                  {Math.round(forecast.main.temp_min)}°C /{" "}
                  {Math.round(forecast.main.temp_max)}°C
                </small>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
};

export default Forecasting;
