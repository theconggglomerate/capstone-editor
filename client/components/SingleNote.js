import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import ReactMarkdown from 'react-markdown'
import {Code} from './../components/'
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
            return <ReactMarkdown key={idx} source={cell.content} />
          }
          if (cell.type === 'code') {
            return <Code key={idx} source={cell.content} />
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
