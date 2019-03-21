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
import {connect} from 'react-redux'
import {deletePopup, deleteNote} from '../store'

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
  toggleModal = (event, cy) => {
    const id = event.target._private.data.id
    console.log('modal open', id)
    if (id.length < 10) this.props.getModal(id)
    else {
      cy.one('tap', 'node', event => this.toggleModal(event, cy))
    }
  }
  deleteNote = cy => {
    this.props.deleteNote(this.props.modal.deleteId)

    cy.remove(`node[id="${this.props.modal.deleteId}"]`)
  }

  deletePopup = id => {
    this.props.deletePopup(id)
  }

  componentDidMount() {
    if (this.props.loadPage) {
      this.props.loadPage()
    }
  }
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
    var cyObj
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
              cyObj = cy
              this.cy = cy
              this.cyto = cy
              let render
              console.log('loaded?', this.props.modal.loaded)
              if (cy && cy._private.emitter.listeners) {
                render = cy._private.emitter.listeners.reduce(
                  (accum, element) => {
                    if (accum) return accum
                    else if (
                      element.event === 'click' &&
                      element.callback.length === 1
                    )
                      return true
                    else {
                      return false
                    }
                  },
                  false
                )
                console.log('render', render)
              }

              if (cy && !render && !this.props.modal.loaded) {
                console.log('first render type', cy._private.emitter)
                const webClick = this.props.webClick
                const editClick = this.props.editClick
                const addAssociation = this.addAssociation
                const deletePopup = this.deletePopup
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
                      content: 'See Web',
                      select: function(ele) {
                        const id = ele.id()
                        webClick(id)
                      }
                    },
                    {
                      content: 'Delete',
                      select: function(ele) {
                        const id = ele.id()
                        deletePopup(id)
                      }
                    }
                  ]
                })

                cy.one('click', 'node', event => this.toggleModal(event, cy))

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

                // } else if (
                //   cy &&
                //   cy._private.emitter.listeners[33].event === 'free'
                // ) {
                //   cy.one('click', 'node', ((event) => this.toggleModal(event,cy)))
                //
              } else if (cy && render && !this.props.modal.loaded) {
                console.log('second render type', cy._private.emitter.listeners)
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
              } else if (cy && !render && this.props.modal.loaded) {
                console.log('just adding the listener')
                cy.one('click', 'node', event => this.toggleModal(event, cy))
              }
            }}
          />
          <Modal open={this.props.modal.modal} closeOnDocumentClick={true}>
            <Button onClick={this.closeModal}>Close Preview</Button>
            <SingleNote noteId={this.props.modal.id} />
          </Modal>
          <Modal open={this.props.modal.warning}>
            <h1>WARNING: Do you want to delete this note?</h1>
            <Button onClick={this.closeModal}> Cancel </Button>
            <Button onClick={() => this.deleteNote(cyObj)}> Delete </Button>
          </Modal>
        </React.Fragment>
      )
    } else {
      return <React.Fragment />
    }
  }
}

const mapDispatchToProps = dispatch => ({
  deletePopup: id => {
    dispatch(deletePopup(id))
  },
  deleteNote: id => {
    dispatch(deleteNote(id))
  }
})

export default connect(null, mapDispatchToProps)(withRouter(Visual))
