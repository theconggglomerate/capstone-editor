import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import {Link} from 'react-router-dom'
import {Button} from 'semantic-ui-react'

class GeneralLinks extends Component {
  componentDidMount() {
    this.props.selectNote()
  }
  render() {
    const {selectedNote} = this.props
    let associations = []
    if (selectedNote.id) {
      associations = selectedNote.source
        .concat(selectedNote.target)
        .map(link => `[${link.title}](/notes/${link.id})`)
    }
    console.log('ASSOCIATIONS', associations)
    return (
      <div>
        <h3>Search Bar!</h3>
        <Link to="/home">Home</Link>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  selectedNote: state.notes.selectedNote
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectNote: () => {
    console.log('OWNPROPS', ownProps)
    const noteId = ownProps.match.params.noteId
    dispatch(selectNote(noteId))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(GeneralLinks)
