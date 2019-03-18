import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Visual from './Visual'
import {connect} from 'react-redux'
import {fetchSingleWeb} from '../store/elements'

export class SingleWeb extends React.Component {
  constructor(props) {
    super(props)
    this.webClick = this.webClick.bind(this)
    this.editClick = this.editClick.bind(this)
  }

  componentDidMount = () => {
    const id = this.props.match.params.id
    this.props.getSingleWeb(id)
  }

  componentDidUpdate = prevprops => {
    const currentId = this.props.match.params.id
    const prevId = prevprops.match.params.id
    if (currentId !== prevId) {
      this.props.getSingleWeb(currentId)
    }
  }

  webClick = id => {
    this.props.history.push(`/visual/${id}`)
  }

  editClick = id => {
    this.props.history.push(`/notes/${id}`)
  }

  render() {
    if (this.props.singleWebElements) {
      const elements = this.props.singleWebElements

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
      return ''
    }
  }
}

const mapStateToProps = state => ({
  singleWebElements: state.elements.singleWeb
})

const mapDispatchToProps = dispatch => ({
  getSingleWeb: id => {
    dispatch(fetchSingleWeb(id))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(SingleWeb)
