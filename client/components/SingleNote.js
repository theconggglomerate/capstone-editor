import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import ReactMarkdown from 'react-markdown'
import {Code} from './../components/'
import CodeDisplay from './CodeDisplay'
import GeneralLinks from './GeneralLinks'
import {Button} from 'semantic-ui-react'

class SingleNote extends Component {
  componentDidMount() {
    this.props.selectNote()
  }

  componentDidUpdate(prevProps) {
    if (this.props.match) {
      if (prevProps.match.params.noteId !== this.props.match.params.noteId) {
        this.props.selectNote()
      }
    } else if (this.props.noteId) {
      if (prevProps.noteId !== this.props.noteId) {
        this.props.selectNote()
      }
    }
  }

  render() {
    let divStyle = window.location.pathname.includes('/visual')
      ? {margin: '3em 3em 3em 3em'}
      : {margin: '3em 25em 3em 25em'}
    const {selectedNote} = this.props
    const noteId = this.props.noteId || this.props.match.params.noteId
    return selectedNote.id ? (
      <div style={divStyle}>
        {window.location.pathname.includes('/notes') ? (
          <Button
            onClick={() =>
              this.props.history.push(`/editor/${selectedNote.id}`)
            }
          >
            Set to Edit View
          </Button>
        ) : (
          ''
        )}
        <h1>{selectedNote.title}</h1>
        {selectedNote.content.cells.map((cell, idx) => {
          if (cell.type === 'markdown') {
            return <ReactMarkdown key={idx} source={cell.content} />
          }
          if (cell.type === 'code') {
            return <CodeDisplay key={idx} source={cell.content} />
          }
        })}
        <div>
          <GeneralLinks noteId={noteId} />
        </div>
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
    const noteId = ownProps.noteId || ownProps.match.params.noteId
    dispatch(selectNote(noteId))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(SingleNote)
