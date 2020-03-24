import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Gapminder from './Gapminder'
import { useInterval } from '../hooks/useInterval'

const GapminderData = () => {
  const data = useStaticQuery(graphql`
    {
      allGapminderJson {
        nodes {
          cluster
          country
          fertility
          id
          life_expect
          pop
          year
        }
      }
    }
  `)

  // let [count, setCount] = useState(0);
  let [year, setYear] = useState(1955);
  let [countries, setCountries] = useState(data.allGapminderJson.nodes.filter(country => country.year === year));

  // let countries = data.allGapminderJson.nodes.filter(country => country.year === 1955)

  useInterval(() => {
    // console.log('countires', counties)

    if (year === 2005) {
      setYear(1955)
      setCountries(data.allGapminderJson.nodes.filter(country => country.year === 1955))
    } else {
      setYear(year + 5)
      setCountries(data.allGapminderJson.nodes.filter(country => country.year === year + 5))
    }
  }, 3000)


  // useInterval(() => {    // Your custom logic here    setCount(count + 1);  }, 1000);

  // useEffect(() => {
  //   const countries = data.allGapminderJson.nodes.filter(country => country.year === 1955)
  // }, [data.allGapminderJson.nodes])

  return <Gapminder data={{ countries, year }}></Gapminder>
}

export default GapminderData