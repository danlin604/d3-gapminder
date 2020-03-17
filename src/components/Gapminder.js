import React, { useRef, useEffect, useState } from 'react'
// import { useStaticQuery, graphql } from 'gatsby'
import * as d3 from 'd3'

const height = 500
const width = 1000
const margin = 50
const Gapminder = ({ data }) => {

  console.log(data)

  // const data = []

  // const data = useStaticQuery(graphql`
  //   {
  //     allGapminderJson {
  //       nodes {
  //         cluster
  //         country
  //         fertility
  //         id
  //         life_expect
  //         pop
  //         year
  //       }
  //     }
  //   }
  // `)

  const container = useRef(null)

  // const [height, setHeight] = useState({});

  useEffect(() => {
    // const countries = data.allGapminderJson.nodes.filter(country => country.year === 1955)
    const countries = data.countries

    const svg = d3.select(container.current)

    svg.selectAll("*").remove()

    const tooltip = svg
      .append('g')
        .append('text')
          .attr('dy', '1em')
          .attr('fill', 'black')
          .style('font-size', 'small')
          .style('z-index', '99')
          .style("opacity", 0)

    const lifeExpectancyScale = d3.scaleLinear()
      .domain([
        0,
        // d3.max(countries, country => country.life_expect + 10)
        90
      ])
      .range([height, 0])

    const fertilityScale = d3.scaleLinear()
      .domain([
        0,
        // d3.max(countries, country => country.fertility + 1)
        9
      ])
      .range([0, width])

    const populationScale = d3.scaleLinear()
      .domain([
        0,
        // d3.max(countries, country => country.pop)
        1303182268
      ])
      .range([2, 64])

    // Add scales to axis
    const y_axis = d3
      .axisLeft()
      .scale(lifeExpectancyScale);

    const x_axis = d3
      .axisBottom()
      .scale(fertilityScale)

    //Append group and insert axis
    svg.append("g")
      .attr("transform", `translate(${ margin }, ${ margin })`)
      .call(y_axis);

    //Append group and insert axis
    svg.append("g")
      .attr("transform", `translate(${ margin }, ${ height + margin })`)
      .call(x_axis);

    const g = svg.append("g")
      .attr("transform", `translate(${ margin }, ${ margin })`)

    const color = d3.scaleOrdinal(d3.schemeTableau10)
      .domain(countries.map(country => country.country))

    g.selectAll("g")
      .data(countries)
      .enter()
      .append('circle')
        .attr("cx", d => fertilityScale(d.fertility))
        .attr("cy", d => lifeExpectancyScale(d.life_expect))
        .style('fill', d => color(d.country))
        .attr('r', d => populationScale(d.pop))
        .on("mouseover", function(d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9)
            .attr("x", d3.event.pageX)
            .attr("y", d3.event.pageY)
            .text(d.country)
          })
        .on("mouseout", function(d) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0)
        })

  // }, [data.allGapminderJson.nodes])
  }, [data])

  return (
    <>
      <h1>{ data.year }</h1>
      <svg
        width={width + 100}
        height={height + 100}
        style={{ border: '1px dotted #999' }}
        ref={ container }>
      </svg>

    </>
  )
}

export default Gapminder