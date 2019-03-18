import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import {withRouter} from 'react-router'
import Axios from 'axios'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'
import Visual from './Visual'

cytoscape.use(cola)

export default withRouter(
  class SingleWeb extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.webClick = this.webClick.bind(this)
      this.editClick = this.editClick.bind(this)
    }

    componentDidMount = async () => {
      const id = this.props.match.params.id
      const elements = await Axios.get(`/api/noteNotes/${id}`)
      this.setState({elements: elements.data})
      console.log(elements.data)
    }

    componentDidUpdate = async prevprops => {
      const currentId = this.props.match.params.id
      const prevId = prevprops.match.params.id
      if (currentId !== prevId) {
        const elements = await Axios.get(`/api/noteNotes/${currentId}`)
        this.setState({elements: elements.data})
      }
    }

    webClick = id => {
      this.props.history.push(`/visual/${id}`)
    }

    editClick = id => {
      this.props.history.push(`/notes/${id}`)
    }

    render() {
      if (this.state.elements) {
        const elements = this.state.elements

        return (
          <React.Fragment>
            <Visual
              elements={CytoscapeComponent.normalizeElements(elements)}
              webClick={this.webClick}
              editClick={this.editClick}
            />
          </React.Fragment>
        )
      } else {
        return 'No elements!'
      }
    }
  }
)
