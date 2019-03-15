import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'

class SingleNote extends Component {
  componentDidMount() {
    this.props.selectNote()
  }

  render() {
    const {selectedNote} = this.props
    return selectedNote.id ? (
      <div>
        <h1>{selectedNote.title}</h1>
        {selectedNote.content.cells.map((cell, idx) => {
          if (cell.type === 'markdown') {
            return (
              <div key={idx}>
                <h4>Markdown Cell</h4>
                {cell.content}
              </div>
            )
          }
          if (cell.type === 'code') {
            return (
              <div key={idx}>
                <h4>Code Cell</h4>
                {cell.content}
              </div>
            )
          }
        })}
      </div>
    ) : (
      ''
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
export default connect(mapStateToProps, mapDispatchToProps)(SingleNote)
