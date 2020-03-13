import React, { useRef, useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import * as d3 from 'd3'

const height = 500
const width = 1000
const margin = 50

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

  const container = useRef(null)

  // const [height, setHeight] = useState({});

  useEffect(() => {
    const countries = data.allGapminderJson.nodes.filter(country => country.year === 1955)

    const svg = d3.select(container.current)

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
        d3.max(countries, country => country.life_expect + 10)
      ])
      .range([height, 0])

    const fertilityScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(countries, country => country.fertility + 1)
      ])
      .range([0, width])

    const populationScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(countries, country => country.pop)
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

    // g.selectAll('text')
    //   .data(countries)
    //   .enter()
    //   .append('text')
    //     .attr('dy', '1em')
    //     .attr('fill', 'black')
    //     .attr('visibility', 'hidden')
    //     .attr("x", d => fertilityScale(d.fertility))
    //     .attr("y", d => lifeExpectancyScale(d.life_expect))
    //     .style('font-size', 'small')
    //     .text(d => d.country)
    
      // .data(dataset)
      // .enter()
      // .append("circle")
      // .attr("cx", (d, i) => d[0])
      // .attr("cy", (d, i) => h - d[1])
      // .attr("r", 5);
    // const margin = {
    //   top: 10,
    //   right: 10,
    //   bottom: 20,
    //   left: 20
    // }

    // const x = d3.scaleLinear()
    //   .domain([0, d3.max(countries, country => country.life_expect)])
    //   .range([0, 940])

    // const y = d3.scaleBand()
    //   .domain(countries.map(d => d.id))
    //   .range([height, 0])

    // const xMargin = x.copy().range([margin.left, 940 - margin.right])
    // const yMargin = y.copy().range([height - margin.bottom, margin.top])

    // const color = d3.scaleOrdinal(d3.schemeTableau10)
    //   .domain(countries.map(country => country.id))

    // const svg = d3.select(container.current)

    // const g = svg.selectAll('g')
    //   .data(countries)
    //   .enter()
    //     .append('g')
    //       .attr('transform', d => `translate(${margin.left}, ${yMargin(d.id)})`)

    // svg.append('g')
    //   .attr('transform', `translate(0, ${height - margin.bottom})`)
    //   .call(d3.axisBottom(xMargin));

    // svg.append('g')
    //   .attr('transform', `translate(${margin.left}, 0)`)
    //   .call(d3.axisLeft(yMargin))
  
    // g.append('rect')
    //     .attr('width', d => xMargin(d.life_expect) - xMargin(0))
    //     .attr('height', yMargin.bandwidth())
    //     .style('fill', d => color(d.id))
    //     .style('stroke', 'white')
    
    // g.append('text')
    //     // .attr('x', d => xMargin(d.life_expect) - xMargin(0))
    //     // .attr('dx', -20)
    //     .attr('dy', '1em')
    //     .attr('fill', 'white')
    //     .style('font-size', 'small')
    //     .text(d => d.country)

  }, [data.allGapminderJson.nodes])

  return (
    <>
      <h1>hello</h1>
      <svg
        width={width + 100}
        height={height + 100}
        style={{ border: '1px dotted #999' }}
        ref={ container }>
      </svg>
    </>
  )
}

export default Test