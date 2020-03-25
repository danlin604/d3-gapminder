import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const Gapminder = ({ data }) => {

  const container = useRef(null)
  
  const height = data.width * .5 - data.width * .1
  const width = data.width * 1 - data.width * .1
  const padding = data.width * .1
  const margin = data.width * .05

  useEffect(() => {
    const countries = data.countries.sort((a, b) => b.pop - a.pop)

    const svg = d3.select(container.current)

    svg.selectAll('*').remove()

    const lifeExpectancyScale = d3.scaleLinear()
      .domain([
        0,
        90
      ])
      .range([height, 0])

    const fertilityScale = d3.scaleLinear()
      .domain([
        0,
        9
      ])
      .range([0, width])

    const populationScale = d3.scaleLinear()
      .domain([
        0,
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
      .attr("x", (width + padding) / 2)
      .attr("y", height + margin / 2)
      .style("text-anchor", "middle")
      .style('font-family', 'Helvetica')
      .style('fill', '#212121')
      .style("font-size", `${width / 1000}rem`)
      .text('Fertility')

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", padding / 4 + margin)
      .attr("x", -(height) / 2 - margin)
      .style("text-anchor", "middle")
      .style('font-family', 'Helvetica')
      .style('fill', '#212121')
      .style("font-size", `${width / 1000}rem`)
      .text('Life Expectancy')

    //Append group and insert axis
    svg.append("g")
      .attr("transform", `translate(${ margin }, ${ margin })`)
      .style('font-family', 'Helvetica')
      .style("font-size", `${width / 1000}rem`)
      .call(y_axis);

    //Append group and insert axis
    svg.append("g")
      .attr("transform", `translate(${ margin }, ${ height + margin })`)
      .style('font-family', 'Helvetica')
      .style("font-size", `${width / 1000}rem`)
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
        .attr("y", d => lifeExpectancyScale(d.life_expect) - padding / 4)
        .attr('dy', '1em')
        .style('fill', '#212121')
        .style('font-family', 'Helvetica')
        .attr("text-anchor", "middle")
        .style('font-size', `${width / 1000}rem`)
        .style('font-weight', 600)
        .style("opacity", 0)
        .style('pointer-events', 'none')
        .text(d => d.country)
    
    svg.append("text")
      .attr('x', padding)
      .attr('y', height)
      .style('font-family', 'Helvetica')
      .style('fill', '#03A9F4')
      .style('font-size', `${width / 100}rem`)
      .style('font-weight', 800)
      .text(data.year)

  }, [data.countries, data.year, height, margin, padding, width])

  return (
    <>
      <svg
        preserveAspectRatio={'xMinYMin meet'}
        width={width + padding}
        height={height + padding}
        style={{ border: '1px dotted #999' }}
        ref={ container }>
      </svg>
    </>
  )
}

export default Gapminder