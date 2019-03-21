import React from 'react'
import Axios from 'axios'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'
import edgehandles from 'cytoscape-edgehandles'
import {Button, Modal} from 'semantic-ui-react'
import {SingleNote} from './index'
import {withRouter} from 'react-router-dom'

cytoscape.use(cxtmenu)
cytoscape.use(cola)
cytoscape.use(edgehandles)

export class Visual extends React.Component {
  constructor(props) {
    super()
    this.addAssociation = this.addAssociation.bind(this)
    this.state = {show: false, id: null, called: true, renders: 0}

    this.cyto = {}
  }

  addAssociation = async (sourceId, targetId) => {
    await Axios.post(`/api/noteNotes/newAssociation`, {sourceId, targetId})
  }
  closeModal = () => {
    console.log('closing modal')
    this.props.closeModal()
  }
  toggleModal = event => {
    const id = event.target._private.data.id
    console.log('modal open', id)
    if (id.length < 10) this.props.getModal(id)
  }

  // componentDidMount() {
  //   if (this.cy) this.cy.destroy()
  // }
  // componentWillUnmount(){
  //   if(this.cy)     this.cy.destroy()
  // }

  countRender = () => {
    let renders = this.state.renders
    renders++
    console.log(renders)
    this.setState({...this.state, renders})
  }
  render() {
    const cyObj = this.cy
    if (this.props.elements.nodes) {
      console.log('elements', this.props.elements)
      return (
        <React.Fragment>
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(this.props.elements)}
            style={{width: '78em', height: '40em'}}
            stylesheet={[
              {
                selector: 'node[label]',
                style: {
                  content: 'data(label)'
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
              this.cy = cy
              this.cyto = cy
              console.log('this.cy at cy', this.cy)
              console.log('listeners', cy._private.emitter.listeners[33])
              if (cy && !cy._private.emitter.listeners[33]) {
                console.log('done', cy._private.emitter.listeners[33])
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
                      }
                    },
                    {
                      content: 'Expand',
                      select: function(ele) {
                        const id = ele.id()

                        const outgoers = cy.getElementById(`${id}`)
                        console.log(outgoers)
                      }
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

                cy.one('click', 'node', this.toggleModal)

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

                console.log('this.cy', cy)

                cy
                  .layout({
                    name: 'cola',

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
              } else if (
                cy &&
                cy._private.emitter.listeners[33].event === 'free'
              ) {
                cy.one('click', 'node', this.toggleModal)
              } else if (cy) {
                cy
                  .layout({
                    name: 'cola',

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
              }
            }}
          />
          <Modal open={this.props.modal.modal} closeOnDocumentClick={true}>
            <Button onClick={this.closeModal}>Close Preview</Button>
            <SingleNote noteId={this.props.modal.id} />
          </Modal>
        </React.Fragment>
      )
    } else {
      return <React.Fragment />
    }
  }
}

export default withRouter(Visual)
