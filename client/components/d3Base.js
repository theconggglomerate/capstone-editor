import React from 'react'
import ReactDOM from 'react-dom'
import CytoscapeComponent from 'react-cytoscapejs'
import Axios from 'axios'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'
import {AllNotes} from './../components'

let cy = cytoscape.use(cxtmenu)
cy.use(cola)

class MyApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = async () => {
    const elements = await Axios.get('/api/noteNotes')
    this.setState({elements: elements.data})
    console.log(elements.data)
  }

  nodeClick = async event => {
    event.preventDefault()
    const id = event.target._private.data.id
    const singleWeb = await Axios.get(`/api/noteNotes/${id}`)
    this.setState({elements: singleWeb.data})
  }

  onSearch = async event => {
    cy.nodes().filter(function(ele) {
      return ele.data('') > 50
    })
  }

  render() {
    if (this.state.elements) {
      const elements = this.state.elements

      return (
        <React.Fragment>
          <AllNotes />

          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(elements)}
            style={{width: '95em', height: '50em'}}
            cy={cy => {
              this.cy = cy

              cy.cxtmenu({
                selector: 'node, edge',
                commands: [
                  {
                    content: '<span class="fa fa-flash fa-2x"></span>',
                    select: function(ele) {
                      console.log(ele.id())
                    }
                  },
                  {
                    content: '<span class="fa fa-star fa-2x"></span>',
                    select: function(ele) {
                      console.log(ele.data('name'))
                    },
                    enabled: false
                  },
                  {
                    content: 'Text',
                    select: function(ele) {
                      console.log(ele.position())
                    }
                  }
                ]
              })
              // cy.cxtmenu({
              //   selector: 'core',
              //   commands: [
              //     {
              //       content: 'bg1',
              //       select: function() {
              //         console.log('bg1')
              //       }
              //     },
              //     {
              //       content: 'bg2',
              //       select: function() {
              //         console.log('bg2')
              //       }
              //     }
              //   ]
              // })
              cy.nodes().style({
                'font-size': function(node) {
                  if (node._private.edges.length === 0) return 20
                  else {
                    return 20 * node._private.edges.length
                  }
                },
                width: function(node) {
                  if (node._private.edges.length === 0) return 50
                  else {
                    return 50 * node._private.edges.length
                  }
                },
                height: function(node) {
                  if (node._private.edges.length === 0) return 50
                  else {
                    return 50 * node._private.edges.length
                  }
                },
                'text-valign': 'center'
              })
              cy
                .layout({
                  name: 'cola',
                  refresh: 7,
                  nodeSpacing: function(node) {
                    if (node._private.edges.length === 0) return 200
                    else {
                      return node._private.edges.length * 15
                    }
                  },
                  nodeDimensionsIncludeLabels: false,
                  nodeRepulsion: 10000,
                  fit: true,
                  edgeLength: function(edge) {
                    return edge._private.source.edges.length * 600
                  }
                })
                .run()
              cy.one('tap', 'node', event => {
                this.nodeClick(event)
              })
            }}
          />
        </React.Fragment>
      )
    } else {
      return 'No elements!'
    }
  }
}

export default MyApp
