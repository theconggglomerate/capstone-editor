import React from 'react'
import Axios from 'axios'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'
import edgehandles from 'cytoscape-edgehandles'

let cy = cytoscape.use(cxtmenu)
cy.use(cola)
cy.use(edgehandles)

export class Visual extends React.Component {
  constructor(props) {
    super()
    this.addAssociation = this.addAssociation.bind(this)
  }

  addAssociation = async (sourceId, targetId) => {
    await Axios.post(`/api/noteNotes/newAssociation`, {sourceId, targetId})
  }
  render() {
    return (
      <React.Fragment>
        <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(this.props.elements)}
          style={{
            width: '78em',
            height: '40em'
          }}
          stylesheet={[
            {
              selector: 'node[title]',
              style: {
                content: 'data(title)'
              }
            },
            {
              selector: 'edge',
              style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle'
              }
            },
            // some style for the extension
            {
              selector: '.eh-handle',
              style: {
                'background-color': 'red',
                width: 12,
                height: 12,
                shape: 'ellipse',
                'overlay-opacity': 0,
                'border-width': 12, // makes the handle easier to hit
                'border-opacity': 0
              }
            },
            {
              selector: '.eh-hover',
              style: {
                'background-color': 'red'
              }
            },
            {
              selector: '.eh-source',
              style: {
                'border-width': 2,
                'border-color': 'red'
              }
            },
            {
              selector: '.eh-target',
              style: {
                'border-width': 2,
                'border-color': 'red'
              }
            },
            {
              selector: '.eh-preview, .eh-ghost-edge',
              style: {
                'background-color': 'red',
                'line-color': 'red',
                'target-arrow-color': 'red',
                'source-arrow-color': 'red'
              }
            },
            {
              selector: '.eh-ghost-edge.eh-preview-active',
              style: {
                opacity: 0
              }
            }
          ]}
          cy={cy => {
            const webClick = this.props.webClick
            const editClick = this.props.editClick
            const addAssociation = this.addAssociation
            cy.cxtmenu({
              selector: 'node, edge',
              commands: [
                {
                  content: 'Edit',
                  select: function(ele) {
                    const id = ele.id()
                    editClick(id)
                    // console.log(ele.data('name'))
                  }
                },
                {
                  content: 'Expand',
                  select: function(ele) {
                    const id = ele.id()
                    // props.expandClick(id)
                    // const outgoers = cy.getElementById(`${id}`)
                    // console.log(outgoers)
                  }
                  // enabled: () => {
                  //   // should return true if single web, should return false if full web. we don't want to exapand the full web.
                  //   return props.elements.length
                  // }
                },
                {
                  content: 'Web',
                  select: function(ele) {
                    const id = ele.id()
                    webClick(id)
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

            cy.edgehandles({
              snap: true,
              complete: function(sourceNode, targetNode, addedEles) {
                //send id
                console.log('sourceNode', sourceNode._private.data.id)
                console.log('targetNode', targetNode._private.data.id)
                const sourceNodeId = sourceNode._private.data.id
                const targetNodeId = targetNode._private.data.id
                addAssociation(sourceNodeId, targetNodeId)
              }
            })
          }}
        />
      </React.Fragment>
    )
  }
}

export default Visual
