import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Axios from 'axios'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'
import Visual from './Visual'

class MyApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.webClick = this.webClick.bind(this)
    this.editClick = this.editClick.bind(this)
  }

  componentDidMount = async () => {
    const elements = await Axios.get('/api/noteNotes')
    this.setState({elements: elements.data})
    console.log(elements.data)
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
            elements={elements}
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

export default MyApp
