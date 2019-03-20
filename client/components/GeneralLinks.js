import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import {Link} from 'react-router-dom'

class GeneralLinks extends Component {
  render() {
    console.log(this.props.selectedNote)
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
    const noteId = ownProps.match.params.noteId
    dispatch(selectNote(noteId))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(GeneralLinks)
