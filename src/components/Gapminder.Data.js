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

  let [year, setYear] = useState(1955)
  let [countries, setCountries] = useState(data.allGapminderJson
    .nodes.filter(country => country.year === year))


  let [width, setWidth] = useState(1000)

  useInterval(() => {

    const clientWidth = document.getElementsByTagName('main')[0].clientWidth

    setWidth(clientWidth > 1000 ? 1000 : clientWidth)

    if (year === 2005) {
      setYear(1955)
      setCountries(data.allGapminderJson.nodes.filter(country => country.year === 1955))
    } else {
      setYear(year + 5)
      setCountries(data.allGapminderJson.nodes.filter(country => country.year === year + 5))
    }
  }, 3000)

  return <Gapminder data={{ countries, year, width }}></Gapminder>
}

export default GapminderData