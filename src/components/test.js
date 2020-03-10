import React, { useRef, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import * as d3 from 'd3'

const Test = () => {
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

  const d3Container = useRef(null)

  useEffect(() => {
    // const popByCountry = d3
    //   .nest()
    //   .key(d => d.country)
    //   .rollup(countryPops => {
    //     return d3.sum(countryPops, countryPop => countryPop.pop)
    //   })
    //   .entries(data.allGapminderJson.nodes)
    //   .map(function(d){
    //       return { country: d.key, pop: d.value };
    //   });

    const popByCountry2005 = data.allGapminderJson.nodes.filter(country => country.year === 2005)

    const ol = d3.select(d3Container.current)

    const x = d3.scaleLinear()
      .domain([0, d3.max(popByCountry2005, country => country.pop)])
      .range([0, 100])

    const color = d3.scaleOrdinal(d3.schemeTableau10)
      .domain(popByCountry2005.map(country => country.id))

    ol
      .selectAll('div')
      .data(popByCountry2005)
      .join('div')
        .style('background', country => color(country.id))
        .style('border', '1px solid white')
        .style('font-size', 'small')
        .style('color', 'white')
        .style('text-align', 'right')
        .style('padding', '3px')
        .style('width', country => `${x(country.pop)}%`)
        .text(country => country.life_expect)

  }, [data.allGapminderJson.nodes, d3Container.current])


  return (
    <>
      <h1>Hello</h1>
      <ol ref={ d3Container }>
      </ol>
    </>
  )
}

export default Test