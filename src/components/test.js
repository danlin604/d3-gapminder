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

    const popByCountry = d3
      .nest()
      .key(d => d.country)
      .rollup(countryPops => {
        return d3.sum(countryPops, countryPop => countryPop.pop)
      })
      .entries(data.allGapminderJson.nodes)
      .map(function(d){
          return { country: d.key, pop: d.value };
      });

    d3.selectAll('li')
    .data(popByCountry)
    .join('li')
      .text(d => `${d.country}: ${d.pop}`)
    // return () => {
    //   cleanup
    // };
  }, [data.allGapminderJson.nodes])


  return (
    <>
      <h1>Hello</h1>
      {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      <ol ref={ d3Container }>
        {/* {
          data.allGapminderJson.nodes.map(node => {
            return (
              <li
                key={ node.id }>
              </li>
            )
          })
        } */}
      </ol>
    </>
  )
}

export default Test