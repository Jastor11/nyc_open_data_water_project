import React from 'react'
import nyc_pop_data from '../../data/nyc_pop.json'
// https://data.cityofnewyork.us/City-Government/New-York-City-Population-by-Borough-1950-2040/xywu-7bv9
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'
import './Population.css'

function Population(props){

  const getData = () => {
    const x_values = Object.keys(nyc_pop_data[0]).filter( key => key.length <= 5)
    const data = x_values.map( x => {
      return {
        year: x.slice(1),
        pop: Number(nyc_pop_data[0][x])
      }
    })

    return data
  }

  return (
    <div className="Population">
      <div className="Population__info">
        <h1>The Population of New York City is Growing Rapidly</h1>
        <p>
          As the population of New York increases,
          we should expect to see water usage and water needs rise.
          By 2040, estimates put the population above 9 million - meaning
          we have to start thinking about how to accommodate so many
          people in such a small space.

        </p>
      </div>
      <VictoryChart
        height={200}
        width={350}
        domain={{ y: [6700000, 9200000]}}
        theme={VictoryTheme.material}
        padding={{ left: 70, top: 50, bottom: 50, right: 30 }}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickFormat={(x) => (x)}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => (`${Number(x / (10**6)).toFixed(2)}mil`)}
        />
        <VictoryLine
          style={{
            data: { stroke: "#61dafb" },
            parent: { border: "1px solid #ccc"}
          }}
          labels={ d => d.y}
          data={getData()}
          x="year"
          y="pop"
        />
      </VictoryChart>
    </div>
  )
}

export default Population
