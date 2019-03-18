import React from 'react'
import Visual from './Visual'
import {connect} from 'react-redux'
import {fetchElements} from '../store/elements'

class MyApp extends React.Component {
  constructor(props) {
    super(props)
    this.webClick = this.webClick.bind(this)
    this.editClick = this.editClick.bind(this)
  }

  componentDidMount = () => {
    this.props.getElements()
  }

  webClick = id => {
    this.props.history.push(`/visual/${id}`)
  }

  editClick = id => {
    this.props.history.push(`/notes/${id}`)
  }
  render() {
    // console.log('THIS.PROPS', this.props)

    if (this.props.allElements) {
      const elements = this.props.allElements

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
      return ''
    }
  }
}

const mapStateToProps = state => ({
  allElements: state.elements.allElements
})

const mapDispatchToProps = dispatch => ({
  getElements: () => {
    dispatch(fetchElements())
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(MyApp)
