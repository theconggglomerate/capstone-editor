import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import ReactMarkdown from 'react-markdown'
import CodeDisplay from './CodeDisplay'
import GeneralLinks from './GeneralLinks'
class LinkPreviewNote extends Component {
  componentDidMount() {
    this.props.selectNote()
    this.props.toggleLoader()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedNote.id !== prevProps.selectedNote.id) {
      this.props.toggleLoader()
    }
  }

  render() {
    const {selectedNote} = this.props
    return (
      <React.Fragment>
        {selectedNote.id && (
          <div>
            <h1> {selectedNote.title} </h1>
            {selectedNote.content.cells.map((cell, idx) => {
              if (cell.type === 'markdown') {
                return <ReactMarkdown key={idx} source={cell.content} />
              }
              if (cell.type === 'code') {
                return <CodeDisplay key={idx} source={cell.content} />
              }
            })}
            <div>
              <GeneralLinks noteId={this.props.noteId} />
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  selectedNote: state.notes.selectedNote
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectNote: () => {
    dispatch(selectNote(ownProps.noteId))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(LinkPreviewNote)
