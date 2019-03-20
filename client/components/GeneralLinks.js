import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'

class GeneralLinks extends Component {
  render() {}
}

const mapStateToProps = state => ({
  selectedNote: state.notes.selectedNote
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectNote: () => {
    const noteId = ownProps.match.params.noteId
    dispatch(selectNote(noteId))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(GeneralLinks)
