import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import ReactMarkdown from 'react-markdown'
import CodeDisplay from './CodeDisplay'
import GeneralLinks from './GeneralLinks'
import {Button, Icon, Container} from 'semantic-ui-react'

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
    const {selectedNote} = this.props
    const noteId = this.props.noteId || this.props.match.params.noteId
    return selectedNote.id ? (
      <Container centered>
        <div
          style={{
            backgroundColor: 'white',
            padding: '2em'
          }}
        >
          {window.location.pathname.includes('/notes') ? (
            <Button
              onClick={() =>
                this.props.history.push(`/editor/${selectedNote.id}`)
              }
            >
              <Button.Content>
                <Icon name="pencil" />
              </Button.Content>
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
      </Container>
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
