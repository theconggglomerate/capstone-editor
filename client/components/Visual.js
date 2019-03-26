/* eslint-disable complexity */
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
  deleteAssociation = async (sourceId, targetId, edgeId, cy) => {
    await Axios.delete('/api/noteNotes/association', {
      data: {sourceId, targetId}
    })
    cy.remove(`edge[id="${edgeId}"]`)
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
          <div className="visual">
            <CytoscapeComponent
              elements={CytoscapeComponent.normalizeElements(
                this.props.elements
              )}
              style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#0F2027'
              }}
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
                    'background-color': '#DAA520',
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
                    'background-color': '#DAA520'
                  }
                },
                {
                  selector: '.eh-source',
                  style: {
                    'border-width': 2,
                    'border-color': '#DAA520'
                  }
                },
                {
                  selector: '.eh-target',
                  style: {
                    'border-width': 2,
                    'border-color': '#DAA520'
                  }
                },
                {
                  selector: '.eh-preview, .eh-ghost-edge',
                  style: {
                    'background-color': '#DAA520',
                    'line-color': '#DAA520',
                    'target-arrow-color': '#DAA520',
                    'source-arrow-color': '#DAA520'
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
                  const deleteAssociation = this.deleteAssociation
                  cy.cxtmenu({
                    selector: 'node',
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

                          console.log(id)
                        }
                      },
                      {
                        content: 'View Web',
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
                  cy.cxtmenu({
                    selector: 'edge',
                    commands: [
                      {
                        content: 'delete association',
                        select: function(ele) {
                          console.log(ele)
                          deleteAssociation(
                            ele._private.data.source,
                            ele._private.data.target,
                            ele._private.data.id,
                            cy
                          )
                        }
                      }
                    ]
                  })

                  cy.one('click', 'node', event => this.toggleModal(event, cy))

                  cy.nodes().style({
                    'font-size': function(node) {
                      if (node._private.edges.length === 0) return 40
                      else {
                        return 20 * node._private.edges.length
                      }
                    },
                    width: function(node) {
                      if (node._private.edges.length === 0) return 75
                      else {
                        return 50 * node._private.edges.length
                      }
                    },
                    height: function(node) {
                      if (node._private.edges.length === 0) return 75
                      else {
                        return 50 * node._private.edges.length
                      }
                    },
                    backgroundColor: function(node) {
                      if (node._private.edges.length === 0) return '#DAA520'
                      else if (
                        node._private.edges.length > 0 &&
                        node._private.edges.length < 3
                      ) {
                        return '#ececec' //grey
                      } else if (
                        node._private.edges.length >= 3 &&
                        node._private.edges.length < 5
                      ) {
                        return '#4286f4' //blue
                      } else if (
                        node._private.edges.length >= 5 &&
                        node._private.edges.length < 6
                      ) {
                        return '#e65600' //orange
                      } else if (node._private.edges.length >= 6) {
                        return '#eb0000' //red
                      }
                    },
                    color: function(node) {
                      if (node._private.edges.length < 3) return '#4286f4'
                      else {
                        return 'white'
                      }
                    },
                    'text-valign': 'center'
                  })

                  cy.edges().style({
                    'line-color': 'white'
                  })
                  cy.edgehandles({
                    snap: true,
                    complete: function(sourceNode, targetNode, addedEles) {
                      const sourceNodeId = sourceNode._private.data.id
                      const targetNodeId = targetNode._private.data.id
                      addAssociation(sourceNodeId, targetNodeId)
                    }
                  })

                  cy
                    .layout({
                      name: 'cola',
                      maxSimulationTime: 3000,
                      nodeSpacing: function(node) {
                        if (node._private.edges.length === 0) return 175
                        else {
                          return node._private.edges.length * 15
                        }
                      },
                      nodeDimensionsIncludeLabels: true,
                      nodeRepulsion: 10000000000,
                      fit: true,
                      edgeLength: function(edge) {
                        return edge._private.source.edges.length * 650
                      }
                    })
                    .run()

                  cy.on('mouseover', 'node', function(event) {
                    const id = event.target._private.data.id
                    const node = cy.getElementById(`${id}`)

                    node.style({
                      'font-size': () => {
                        const size = 5 * (1 / cy.zoom())
                        return `${size}em`
                      },
                      'z-index': 2,
                      color: 'white'
                    })
                  })

                  cy.on('mouseout', 'node', function(event) {
                    const id = event.target._private.data.id
                    const node = cy.getElementById(`${id}`)
                    node.style({
                      'font-size': function() {
                        if (node._private.edges.length === 0) return 40
                        else {
                          return 20 * node._private.edges.length
                        }
                      },
                      color: function() {
                        if (node._private.edges.length < 3) return '#4286f4'
                        else {
                          return 'white'
                        }
                      }
                    })
                  })

                  // } else if (
                  //   cy &&
                  //   cy._private.emitter.listeners[33].event === 'free'
                  // ) {
                  //   cy.one('click', 'node', ((event) => this.toggleModal(event,cy)))
                  //
                  cy.on('layoutstop', () => {
                    cy.zoom(0.05)
                  })
                } else if (cy && render && !this.props.modal.loaded) {
                  console.log(
                    'second render type',
                    cy._private.emitter.listeners
                  )
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
                      if (node._private.edges.length === 0) return 40
                      else {
                        return 20 * node._private.edges.length
                      }
                    },
                    width: function(node) {
                      if (node._private.edges.length === 0) return 75
                      else {
                        return 50 * node._private.edges.length
                      }
                    },
                    height: function(node) {
                      if (node._private.edges.length === 0) return 75
                      else {
                        return 50 * node._private.edges.length
                      }
                    },
                    backgroundColor: function(node) {
                      if (node._private.edges.length === 0) return '#DAA520'
                      else if (
                        node._private.edges.length > 0 &&
                        node._private.edges.length < 3
                      ) {
                        return '#ececec' //grey
                      } else if (
                        node._private.edges.length >= 3 &&
                        node._private.edges.length < 5
                      ) {
                        return '#4286f4' //blue
                      } else if (
                        node._private.edges.length >= 5 &&
                        node._private.edges.length < 6
                      ) {
                        return '#e65600' //orange
                      } else if (node._private.edges.length >= 6) {
                        return '#eb0000' //red
                      }
                    },
                    color: function(node) {
                      if (node._private.edges.length < 3) return '#4286f4'
                      else {
                        return 'white'
                      }
                    },
                    'text-valign': 'center'
                  })

                  cy.edges().style({
                    'line-color': 'white'
                  })
                } else if (cy && !render && this.props.modal.loaded) {
                  console.log('just adding the listener')
                  cy.one('click', 'node', event => this.toggleModal(event, cy))
                }
              }}
            />
            <Modal
              open={this.props.modal.modal}
              closeOnDocumentClick={true}
              style={{padding: '3em'}}
            >
              <div style={{textAlign: 'right'}}>
                <Button color="red" onClick={this.closeModal}>
                  Close Preview
                </Button>
              </div>

              <SingleNote noteId={this.props.modal.id} />
            </Modal>
            <Modal open={this.props.modal.warning}>
              <h1>WARNING: Do you want to delete this note?</h1>
              <Button onClick={this.closeModal}> Cancel </Button>
              <Button onClick={() => this.deleteNote(cyObj)}> Delete </Button>
            </Modal>
          </div>
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
