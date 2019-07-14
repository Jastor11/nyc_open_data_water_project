import React from 'react'
import nyc_water_consumption from '../../data/nyc_water_consumption.json'
// https://data.cityofnewyork.us/Environment/Water-Consumption-In-The-New-York-City/ia2d-e54m
import { VictoryArea, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'
import './WaterConsumption.css'

function WaterConsumption(props){

  const getData = () => {
    const x_values = nyc_water_consumption.map( d => d.year )
    const y_values = nyc_water_consumption.map( d => d.nyc_consumption_million_gallons_per_day )
    const data = []
    for (let i = 0; i < x_values.length; i++){
      data.push({
        year: Number(x_values[i]),
        gpd:  Number(y_values[i])
      })
    }
    return data
  }

  return (
    <div className="WaterConsumption">
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [800, 1600]}}
        height={200}
        width={400}
      >
        <VictoryAxis
          tickFormat={(x) => (x)}
          label="Year"
          style={{
            axisLabel: {fontSize: 20, padding: 20},
            grid: {stroke: (t) => t > 0.5 ? "red" : "grey"},
            tickLabels: {fontSize: 15, padding: 5}
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (Number(x)/1000).toFixed(3)}
          label="Billions of gallons per day"
          style={{
            axisLabel: {fontSize: 20, padding: 40},
          }}
        />
        <VictoryArea
          style={{
            data: {
              fill: "#61dafb",
              fillOpacity: 0.7,
              stroke: "#61dafb",
              strokeWidth: 3
            }
          }}
          data={getData()}
          x="year"
          y="gpd"
        />
      </VictoryChart>
      <div className="WaterConsumption__info">
        <h1>Water Consumption</h1>
        <p>
          The area chart on left shows the rate at which
          New York has been consuming water over the last 40 years.
          Notice how we've started to use less water over the year?
          This trend needs to continue if we want to preserve one of
          our most important natural resources.
        </p>
      </div>
    </div>
  )
}

export default WaterConsumption
