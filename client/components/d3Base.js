import React from 'react'
import ReactDOM from 'react-dom'
import CytoscapeComponent from 'react-cytoscapejs'
import Axios from 'axios'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import coseBilkent from 'cytoscape-cose-bilkent'

let cy = cytoscape.use(cxtmenu)
cy.use(coseBilkent)

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

  render() {
    if (this.state.elements) {
      const elements = this.state.elements
      // const elements = [
      //   {data: {id: 'one', label: 'Node 1'}, position: {x: 0, y: 0}},
      //   {data: {id: 'two', label: 'Node 2'}, position: {x: 100, y: 50}},
      //   {data: {id: 'three', label: 'Node 3'}, position: {x: 200, y: 0}},
      //   {data: {source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}},
      //   {
      //     data: {
      //       source: 'one',
      //       target: 'three',
      //       label: 'Edge from node 1 to node 3'
      //     }
      //   },
      //   {
      //     data: {
      //       source: 'three',
      //       target: 'two',
      //       label: 'Edge from node 3 to node 2'
      //     }
      //   }
      // ]

      return (
        <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(elements)}
          style={{width: '1000px', height: '1000px'}}
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
            cy.cxtmenu({
              selector: 'core',
              commands: [
                {
                  content: 'bg1',
                  select: function() {
                    console.log('bg1')
                  }
                },
                {
                  content: 'bg2',
                  select: function() {
                    console.log('bg2')
                  }
                }
              ]
            })
            cy
              .layout({
                name: 'cose-bilkent',
                animate: 'end',
                animationEasing: 'ease-out',
                animationDuration: 1000,
                randomize: true
              })
              .run()
          }}
        />
      )
    } else {
      return 'No elements!'
    }
  }
}

export default MyApp
