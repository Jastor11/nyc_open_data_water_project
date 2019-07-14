import React from 'react'
import wbb1 from '../../data/water_consumption_by_borough_01_01_2017.json'
import wbb2 from '../../data/water_consumption_by_borough_02_01_2017.json'
import wbb3 from '../../data/water_consumption_by_borough_03_01_2017.json'
import wbb4 from '../../data/water_consumption_by_borough_01_01_2018.json'
import wbb5 from '../../data/water_consumption_by_borough_02_01_2018.json'
import wbb6 from '../../data/water_consumption_by_borough_03_01_2018.json'
import wbb7 from '../../data/water_consumption_by_borough_01_01_2019.json'
import wbb8 from '../../data/water_consumption_by_borough_02_01_2019.json'
import wbb9 from '../../data/water_consumption_by_borough_03_01_2019.json'
// import water_by_borough from '../../data/nyc_water_by_borough.json'
// https://data.cityofnewyork.us/Housing-Development/Water-Consumption-And-Cost-2013-March-2019-/66be-66yr
import {
  VictoryArea, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryStack, VictoryLegend
} from 'victory'
import './WaterByBorough.css'

function WaterByBorough(props){

  const getData = () => {
    const all_data = {
      wbb1, wbb2, wbb3,
      wbb4, wbb5, wbb6,
      wbb7, wbb8, wbb9
    }

    const monthsOnly = row => {
        if (!row['borough']) return false
        const days = Number(row.days)
        return (days > 26 && days < 40)
    }

    const data = Object.keys(all_data)
      .map( key  => all_data[key])
      .map( json => json.filter(monthsOnly) )
      .reduce( (p, c, i) => {
        return [...p, ...c]
      }, [])

    return data
  }

  const aggregateByBoroughAndDate = intermediate_data => {
    const boroughs = [...new Set(intermediate_data.map(item => item.borough))]
    const dates    = [...new Set(intermediate_data.map(item => item.date))]

    const consumption_by_borough = {}
    boroughs.forEach(b => consumption_by_borough[b] = [])
    // aggregate by borough and revenue month date
    intermediate_data.forEach( ({ borough, date, value }) => {
      consumption_by_borough[borough].push({ date, value })
    })

    const res = {}
    boroughs.forEach(b => {
      res[b] = {}
      dates.forEach(d => {
        res[b][d] = 0
      })
    })
    boroughs.forEach(b => {
      consumption_by_borough[b].forEach(({ date, value }) => {
        res[b][date] += value
      })
    })


    const final_data = {}
    boroughs.forEach(b => final_data[b] = [])
    boroughs.forEach(b => {
      Object.keys(res[b]).forEach(date => {
        final_data[b].push({
          date, value: res[b][date]
        })
      })
    })

    return final_data
  }

  const getAverageCost = () => {
    const filtered_data = getData()

    const intermediate_data = filtered_data.map( (row, idx) => {
      const date = row['revenue_month'].split('-')[0]+'-'+row['revenue_month'].split('-')[1]+'-01'
      return {
        date,
        borough: row['borough'],
        value: (Number(row.current_charges)/Number(row.days))
      }
    })

    return aggregateByBoroughAndDate(intermediate_data)
  }

  const getAverageConsumption = () => {
    const filtered_data = getData()

    const intermediate_data = filtered_data.map( (row, idx) => {
      const date = row['revenue_month'].split('-')[0]+'-'+row['revenue_month'].split('-')[1]+'-01'
      return {
        date,
        borough: row['borough'],
        value: (Number(row.consumption_hcf)/Number(row.days))
      }
    })

    return aggregateByBoroughAndDate(intermediate_data)
  }


  // Colors
  const yellow200 = "#FFF59D"
  const deepOrange600 = "#F4511E"
  const lime300 = "#DCE775"
  const lightGreen500 = "#8BC34A"
  const teal700 = "#00796B"
  const cyan900 = "#006064"
  const colors = [
    deepOrange600,
    yellow200,
    lime300,
    lightGreen500,
    teal700,
    cyan900
  ]
  const blueGrey50 = "#ECEFF1"
  const blueGrey300 = "#90A4AE"
  const blueGrey700 = "#455A64"
  const grey900 = "#212121"

  // <p>{JSON.stringify(getTotalAmt(), null, 2)}</p>
  // <p>{JSON.stringify(getBuroughs(), null, 2)}</p>
  // <p>{JSON.stringify(getAverageCost(), null, 2)}</p>
  // <p>{JSON.stringify(getAverageConsumption(), null, 2)}</p>

  return (
    <div className="WaterByBorough">
      <h1>Average Water Consumption By Borough</h1>

      <VictoryChart
        theme={VictoryTheme.material}
        height={400}
        width={600}
        domain={{ y: [0, 3000.0]}}
      >
        <VictoryAxis
          tickFormat={(x) => (x)}
          label="Month"
          style={{
            axisLabel: {fontSize: 20, padding: 20},
            tickLabels: {fontSize: 15, padding: 5}
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (Number(x)/100).toFixed(3)}
          label="Average Water Consumption"
          style={{
            axisLabel: {fontSize: 20, padding: 40},
          }}
        />
        <VictoryLegend x={50} y={20}
        	title=""
          centerTitle
          orientation="horizontal"
          gutter={20}
          style={{
            border: {
              stroke: "black",
              strokeWidth: 2
            },
            title: { fontSize: 20 }
          }}
          data={[
            { name: "BROOKLYN", symbol: { fill: teal700 } },
            { name: "BRONX", symbol: { fill: cyan900 } },
            { name: "QUEENS", symbol: { fill: "#61dafb" } },
            { name: "MANHATTAN", symbol: { fill: "blue" } },
            { name: "STATEN ISLAND", symbol: { fill: "pink" } },
            { name: "FHA", symbol: { fill: deepOrange600 } }
          ]}
        />
        <VictoryStack
          style={{
            data: { stroke: "black", strokeWidth: 1 }
          }}
        >
          <VictoryArea
            style={{ data: { fill: teal700 } }}
            data={getAverageConsumption()['BROOKLYN']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: cyan900 } }}
            data={getAverageConsumption()['BRONX']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: '#61dafb' } }}
            data={getAverageConsumption()['QUEENS']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: 'blue' } }}
            data={getAverageConsumption()['MANHATTAN']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: 'pink' } }}
            data={getAverageConsumption()['STATEN ISLAND']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: yellow200 } }}
            data={getAverageConsumption()['NON DEVELOPMENT FACILITY']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: deepOrange600 } }}
            data={getAverageConsumption()['FHA']}
            x="date"
            y="value"
          />
        </VictoryStack>
      </VictoryChart>

      <h1>Average Water Spending By Borough</h1>

      <VictoryChart
        theme={VictoryTheme.material}
        height={400}
        width={650}
        domain={{ y: [0, 30000.0]}}
        padding={{ left: 70, top: 50, bottom: 50, right: 30 }}
      >
        <VictoryAxis
          tickFormat={(x) => (x)}
          label="Month"
          style={{
            axisLabel: {fontSize: 20, padding: 20},
            tickLabels: {fontSize: 15, padding: 5}
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (Number(x)).toFixed(3)}
          label="Average $$ Spent on Water"
          style={{
            axisLabel: {fontSize: 20, padding: 60},
          }}
        />
        <VictoryLegend x={70} y={20}
        	title=""
          centerTitle
          orientation="horizontal"
          gutter={20}
          style={{
            border: {
              stroke: "black",
              strokeWidth: 2
            },
            title: { fontSize: 20 }
          }}
          data={[
            { name: "BROOKLYN", symbol: { fill: teal700 } },
            { name: "BRONX", symbol: { fill: cyan900 } },
            { name: "QUEENS", symbol: { fill: "#61dafb" } },
            { name: "MANHATTAN", symbol: { fill: "blue" } },
            { name: "STATEN ISLAND", symbol: { fill: "pink" } },
            { name: "FHA", symbol: { fill: deepOrange600 } }
          ]}
        />
        <VictoryStack
          style={{
            data: { stroke: "black", strokeWidth: 1 }
          }}
        >
          <VictoryArea
            style={{ data: { fill: teal700 } }}
            data={getAverageCost()['BROOKLYN']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: cyan900 } }}
            data={getAverageCost()['BRONX']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: '#61dafb' } }}
            data={getAverageCost()['QUEENS']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: 'blue' } }}
            data={getAverageCost()['MANHATTAN']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: 'pink' } }}
            data={getAverageCost()['STATEN ISLAND']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: yellow200 } }}
            data={getAverageCost()['NON DEVELOPMENT FACILITY']}
            x="date"
            y="value"
          />
          <VictoryArea
            style={{ data: { fill: deepOrange600 } }}
            data={getAverageCost()['FHA']}
            x="date"
            y="value"
          />
        </VictoryStack>
      </VictoryChart>
    </div>
  )
}

export default WaterByBorough
