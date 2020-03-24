import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const height = 500
const width = 1000
const margin = 50
const Gapminder = ({ data }) => {

  const container = useRef(null)

  useEffect(() => {
    const countries = data.countries.sort((a, b) => b.pop - a.pop)

    const svg = d3.select(container.current)

    svg.selectAll('*').remove()

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
      .scale(lifeExpectancyScale)

    const x_axis = d3
      .axisBottom()
      .scale(fertilityScale)

    // Axis label
    svg.append("text")
      .attr("x", (width + 100) / 2)
      .attr("y", height + 75)
      .style("text-anchor", "middle")
      .style('font-family', 'Helvetica')
      .style('fill', '#212121')
      .style('font-weight', 600)
      .text('Fertility')

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -(height) / 2)
      .style("text-anchor", "middle")
      .style('font-family', 'Helvetica')
      .style('fill', '#212121')
      .style('font-weight', 600)
      .text('Life Expectancy')

    //Append group and insert axis
    svg.append("g")
      .attr("transform", `translate(${ margin }, ${ margin })`)
      .style('font-family', 'Helvetica')
      .style("font-size","10px")
      .call(y_axis);

    //Append group and insert axis
    svg.append("g")
      .attr("transform", `translate(${ margin }, ${ height + margin })`)
      .style('font-family', 'Helvetica')
      .style("font-size","10px")
      .call(x_axis);

    const g = svg.append("g")
      .attr("transform", `translate(${ margin }, ${ margin })`)

    const color = d3.scaleOrdinal(d3.schemeTableau10)
      .domain(countries.map(country => country.country))

    g.selectAll("g")
      .data(countries)
      .enter()
      .append('circle')
        .attr("class", d => d.country.split(' ').join(''))
        .attr("cx", d => fertilityScale(d.fertility))
        .attr("cy", d => lifeExpectancyScale(d.life_expect))
        .style('fill', d => color(d.country))
        .attr('r', d => populationScale(d.pop))
        .on("mouseover", d => {

          d3.select(`circle.${ d.country.split(' ').join('') }`)
            .transition()
            .duration(500)
            .style('opacity', .3)

          d3.select(`text.${ d.country.split(' ').join('') }`)
            .transition()
            .duration(500)
            .style('opacity', .9)

          })
        .on("mouseout", d => {

          d3.select(`circle.${ d.country.split(' ').join('') }`)
            .transition()
            .duration(500)
            .style('opacity', 1)

          d3.select(`text.${ d.country.split(' ').join('') }`)
            .transition()
            .duration(500)
            .style('opacity', 0)
        })

    g.selectAll('g')
      .data(countries)
      .enter()
      .append('text')
        .attr("class", d => d.country.split(' ').join(''))
        .attr("x", d => fertilityScale(d.fertility))
        .attr("y", d => lifeExpectancyScale(d.life_expect) - 25)
        .attr('dy', '1em')
        .style('fill', '#212121')
        .style('font-family', 'Helvetica')
        .attr("text-anchor", "middle")
        .style('font-size', '100%')
        .style('font-weight', 600)
        .style("opacity", 0)
        .style('pointer-events', 'none')
        .text(d => d.country)
    
    svg.append("text")
      .attr('x', 100)
      .attr('y', height)
      .style('font-family', 'Helvetica')
      .style('fill', '#03A9F4')
      .style('font-size', '1000%')
      .style('font-weight', 800)
      .text(data.year)

  }, [data.countries, container.current, data.year])

  return (
    <>
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