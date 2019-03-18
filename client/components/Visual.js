import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'

let cy = cytoscape.use(cxtmenu)
cy.use(cola)

const Visual = props => {
  return (
    <React.Fragment>
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(props.elements)}
        style={{width: '78em', height: '40em'}}
        cy={cy => {
          cy.cxtmenu({
            selector: 'node, edge',
            commands: [
              {
                content: 'Edit',
                select: function(ele) {
                  const id = ele.id()
                  props.editClick(id)
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
                content: 'Web',
                select: function(ele) {
                  const id = ele.id()
                  props.webClick(id)
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
              refresh: 4,
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
          // cy.one('tap', 'node', event => {
          //   this.nodeClick(event)
          // })
        }}
      />
    </React.Fragment>
  )
}

export default Visual
