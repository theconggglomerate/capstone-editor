import React, {Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/jsx'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/markdown'
import 'brace/snippets/markdown'
import ReactMarkdown from 'react-markdown'
import {LinkPreview} from './../components/'
import CodeDisplay from './CodeDisplay'
import {connect} from 'react-redux'
import {
  selectNote,
  makeCodeBlock,
  makeMarkdownBlock,
  editBlock,
  getProject,
  createProject,
  saveProject,
  editTitle,
  clearEditor,
  clearNote,
  deletePopup,
  turnOffModal,
  deleteNote
} from './../store'
import AssocSearch from './AssocSearch'
import {ReactiveBase} from '@appbaseio/reactivesearch'
import GeneralLinks from './GeneralLinks'
import {Grid, Button, Input, Modal} from 'semantic-ui-react'
import {ScrollSync, ScrollSyncPane} from 'react-scroll-sync'
import brace from 'brace'
import 'brace/theme/katzenmilch'
import 'brace/theme/cobalt'
import ScrollLock from 'react-scrolllock'

import debounce from 'lodash.debounce'

export class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      cells: [],
      theme: 'cobalt',
      enableLiveAutocompletion: true,
      fontSize: 14,
      currentIdx: 0,
      currentEditor: false,
      searchVisible: false
    }
  }

  refresh = () => {
    const noteId = this.props.match.params.noteId

    if (noteId === 'new') {
      this.props.clearEditor()
      this.props.clearNote()
      this.props.history.push('/editor')
    } else if (noteId) {
      this.props.getProject(noteId)
      this.props.selectNote(noteId)
    } else if (this.props.editor.id) {
      const id = this.props.editor.id
      this.props.history.push(`/editor/${id}`)
    }
    this.allowNavigate()
  }

  allowNavigate = () => {
    if (
      this.refs[0] &&
      this.refs[0].editor &&
      !this.refs[0].editor.keyBinding.$handlers[1]
    ) {
      let xander = 0
    }

    const editorScroll = this.refs['editor-scroll']
    const renderScroll = this.refs['render-scroll']
    for (let i in this.refs) {
      if (
        this.refs.hasOwnProperty(i) &&
        i !== 'render-scroll' &&
        i !== 'editor-scroll'
      ) {
        const this_ref = this.refs[i]
        const editor = this.refs[i].editor

        let nextEditor = undefined
        let prevEditor = undefined
        let nextNum = parseInt(i, 10)
        let prevNum = nextNum - 1
        nextNum++
        let nextRef = undefined
        let prevRef = undefined
        console.log('nextNum', nextNum)
        console.log('prevNum', prevNum)

        if (this.refs.hasOwnProperty(nextNum)) {
          nextRef = this.refs[nextNum]
          nextEditor = this.refs[nextNum].editor
          console.log('nextEditor', nextEditor)
        }
        if (this.refs.hasOwnProperty(prevNum)) {
          prevEditor = this.refs[prevNum].editor
          prevRef = this.refs[prevNum]
          console.log('prevEditor', prevEditor)
        }
        this.refs[i].editor.on('click', () =>
          this.setState({...this.state, currentEditor: editor})
        )
        this.refs[i].editor.keyBinding.addKeyboardHandler(
          (data, hash, keyString, keyCode, event) => {
            if (
              editor.getCursorPosition().row === editor.getLastVisibleRow() &&
              nextEditor &&
              keyString === 'down'
            ) {
              console.log('move to next', nextEditor)
              nextEditor.moveCursorTo(0, 0)
              nextEditor.focus()
              this.setState({...this.state, currentEditor: nextEditor})
            } else if (
              editor.getCursorPosition().row === 0 &&
              prevEditor &&
              keyString === 'up'
            ) {
              console.log('move to prev', prevEditor)
              prevEditor.moveCursorTo(prevEditor.getLastVisibleRow(), 0)
              prevEditor.focus()
              this.setState({...this.state, currentEditor: prevEditor})
            }

            if (
              editorScroll.scrollTop >
              editor.container.offsetTop +
                editor.getCursorPosition().row * 14.54545
            ) {
              editorScroll.scrollTop -= 40
            }
            if (
              editor.container.offsetTop +
                editor.getCursorPosition().row * 14.54545 >
              editorScroll.scrollTop + 0.85 * window.innerHeight - 70
            ) {
              editorScroll.scrollTop += 40
            }
          }
        )
      }
    }
    console.log(this.refs)
  }

  componentDidMount = () => {
    this.refresh()
  }

  componentDidUpdate = prevProps => {
    if (prevProps.match.params.noteId !== this.props.match.params.noteId) {
      this.refresh()
    }
    if (prevProps.editor.id !== this.props.editor.id) {
      this.refresh()
    }
  }

  new = () => {
    this.props.history.push('/editor/new')
  }

  save = () => {
    if (
      (this.props.match.params.noteId &&
        this.props.match.params.noteId !== 'new' &&
        this.props.match.params.noteId !== 'null') ||
      this.props.editor.id
    ) {
      this.props.saveProject(
        this.props.match.params.noteId || this.props.editor.id,
        this.props.editor.title,
        this.props.editor.cells
      )
    } else {
      this.props.createProject(
        this.props.editor.title,
        this.props.editor.cells,
        this.props.history
      )
    }
    this.refresh()
  }

  deletePopup = () => {
    this.props.deleteConfirm()
  }

  closeModal = () => {
    this.props.closeModal()
  }

  deleteNote = () => {
    const id = this.props.editor.id || this.props.match.params.noteId
    this.props.deleteNote(id)
    this.new()
  }

  insertText = text => {
    if (!this.state.currentEditor) {
      this.refs[0].editor.insert(text)
    } else {
      this.state.currentEditor.insert(text)
    }
  }

  createAssociation = (id, title) => {
    const origin = window.location.origin
    const link = `[${title}](${origin}/notes/${id})`
    this.insertText(link)
    this.setState({...this.state, searchVisible: false})
  }

  searchPopup = () => {
    this.setState({...this.state, searchVisible: true})
  }

  closeSearchPopup = () => {
    this.setState({...this.state, searchVisible: false})
  }

  autosave = debounce(this.save, 1000, {trailing: true})

  handleTitle = event => {
    event.preventDefault()
    const title = event.target.value
    this.props.editTitle(title)
    this.autosave()
  }

  handleChange = debounce(
    (newValue, idx) => {
      this.props.editBlock(newValue, idx)
      this.autosave()
    },
    100,
    {trailing: true}
  )

  newCode = () => {
    this.props.makeNewCodeBlock()
  }

  newMarkdown = () => {
    this.props.makeNewMarkdownBlock()
  }

  render() {
    const id = this.props.match.params.noteId
    return (
      <div className="editorcontainer">
        <ScrollSync>
          <div style={{paddingLeft: '3em'}}>
            <ScrollLock>
              <div style={{padding: '1.5em', marginRight: '1em'}}>
                {' '}
                {/* <Button inverted={true} color="white" onClick={this.save}>
                      {' '}
                      Save Note
                    </Button> */}
                <Button inverted={true} onClick={this.new}>
                  {' '}
                  Create a New Note
                </Button>
                <Button inverted={true} onClick={this.searchPopup}>
                  Insert Link
                </Button>
                {this.props.match.params.noteId ? (
                  <>
                    <Button
                      inverted={true}
                      onClick={() => {
                        this.props.history.push(`/notes/${id}`)
                      }}
                    >
                      {' '}
                      Set to Render View
                    </Button>
                    <Button
                      inverted={true}
                      onClick={() => {
                        this.props.history.push(`/visual/${id}`)
                      }}
                    >
                      {' '}
                      Visualize
                    </Button>
                    <Button negative onClick={this.deletePopup}>
                      Delete note
                    </Button>
                  </>
                ) : (
                  ''
                )}
              </div>
              <Grid divided="vertically">
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <ScrollSyncPane>
                      <div className="scrollable" ref="editor-scroll">
                        <Input
                          style={{
                            margin: '3em 1em 2em 1em',
                            height: '3em',
                            width: '95%'
                          }}
                          type="text"
                          onChange={this.handleTitle}
                          value={this.props.editor.title}
                          placeholder="Enter a title..."
                        />
                        {this.props.editor.cells
                          ? this.props.editor.cells.map((cell, idx) => {
                              return cell.type === 'code' ? (
                                <div className="code" key={idx + 'edcd'}>
                                  <AceEditor
                                    ref={idx}
                                    mode="javascript"
                                    theme={this.state.theme}
                                    name="CodeEditor"
                                    onChange={value =>
                                      this.handleChange(value, idx)
                                    }
                                    value={this.props.editor.cells[idx].content}
                                    fontSize={this.state.fontSize}
                                    showPrintMargin={true}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    width="100%"
                                    editorProps={{$blockScrolling: Infinity}}
                                    setOptions={{
                                      enableBasicAutocompletion: true,
                                      enableLiveAutocompletion: this.state
                                        .enableLiveAutocompletion,
                                      enableSnippets: true,
                                      showLineNumbers: true,
                                      tabSize: 2,
                                      maxLines: 100,
                                      minLines: 3,
                                      wrap: true
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="markdown" key={idx + 'edmd'}>
                                  <AceEditor
                                    ref={idx}
                                    mode="markdown"
                                    theme="katzenmilch"
                                    name="MarkdownEditor"
                                    onChange={value =>
                                      this.handleChange(value, idx)
                                    }
                                    value={this.props.editor.cells[idx].content}
                                    fontSize={this.state.fontSize}
                                    showPrintMargin={true}
                                    showGutter={true}
                                    highlightActiveLine={false}
                                    highlightActiveWord={true}
                                    width="100%"
                                    editorProps={{$blockScrolling: Infinity}}
                                    setOptions={{
                                      enableBasicAutocompletion: true,
                                      enableLiveAutocompletion: this.state
                                        .enableLiveAutocompletion,
                                      enableSnippets: true,
                                      showLineNumbers: true,
                                      tabSize: 2,
                                      maxLines: 100,
                                      minLines: 3,
                                      wrap: true
                                    }}
                                  />
                                </div>
                              )
                            })
                          : ''}
                        <div style={{margin: '3em 2em 8em 2em'}}>
                          <Button
                            style={{marginRight: '1em'}}
                            className="button"
                            inverted={true}
                            onClick={this.newCode}
                          >
                            New Code Block
                          </Button>
                          <Button
                            style={{marginRight: '1em'}}
                            className="button"
                            inverted={true}
                            onClick={this.newMarkdown}
                          >
                            {' '}
                            New Markdown Block{' '}
                          </Button>

                          <GeneralLinks
                            style={{marginRight: '1em'}}
                            noteId={this.props.match.params.noteId}
                          />
                        </div>
                      </div>
                    </ScrollSyncPane>
                  </Grid.Column>
                  <Grid.Column>
                    <ScrollSyncPane>
                      <div className="scrollable">
                        {this.props.editor.cells ? (
                          <React.Fragment>
                            <h1>{this.props.editor.title}</h1>
                            {this.props.editor.cells.map((cell, idx) => {
                              if (cell.type === 'markdown') {
                                return (
                                  <ReactMarkdown
                                    key={idx + 'md'}
                                    source={cell.content}
                                    renderers={{
                                      link: link => {
                                        const replaceURLsWithIds = new RegExp(
                                          /.*(\/notes\/\d+).*/
                                        )
                                        const findNoteURL = new RegExp(
                                          `${
                                            window.location.origin
                                          }/notes\/\\d+`
                                        )
                                        if (findNoteURL.test(link.href)) {
                                          return (
                                            <LinkPreview
                                              title={
                                                link.children[0].props.value
                                              }
                                              previewedNote={
                                                link.href
                                                  .replace(
                                                    replaceURLsWithIds,
                                                    '$1'
                                                  )
                                                  .split('/')[2]
                                              }
                                            />
                                          )
                                        } else
                                          return (
                                            <a href={link.href}>
                                              {link.children[0].props.value}
                                            </a>
                                          )
                                      },
                                      paragraph: ({children}) => (
                                        <div>{children}</div>
                                      )
                                    }}
                                  />
                                )
                              }
                              if (cell.type === 'code') {
                                return (
                                  <CodeDisplay
                                    key={idx + 'cd'}
                                    keyr={idx + 'cde'}
                                    source={cell.content}
                                  />
                                )
                              }
                            })}
                          </React.Fragment>
                        ) : (
                          ''
                        )}

                        <br />
                        <br />
                        <br />
                      </div>
                    </ScrollSyncPane>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </ScrollLock>
          </div>
        </ScrollSync>
        <Modal open={this.props.modal.warning} style={{padding: '3em'}}>
          <h1>Are you sure you want to delete this note?</h1>
          <Button onClick={this.closeModal} style={{marginRight: '1em'}}>
            {' '}
            Cancel{' '}
          </Button>
          <Button
            negative
            onClick={this.deleteNote}
            style={{marginRight: '1em'}}
          >
            {' '}
            Delete{' '}
          </Button>
        </Modal>
        <Modal
          open={this.state.searchVisible}
          closeOnDimmerClick={true}
          onClose={this.closeSearchPopup}
        >
          <ReactiveBase app="notes" url={`${window.location.origin}/api/es`}>
            <AssocSearch
              noteId={this.props.noteId}
              makeAssociation={this.createAssociation}
            />
          </ReactiveBase>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    editor: state.editor,

    modal: state.modal
  }
}

const mapDispatchToProps = dispatch => {
  return {
    makeNewCodeBlock: () => {
      dispatch(makeCodeBlock())
    },
    makeNewMarkdownBlock: () => {
      dispatch(makeMarkdownBlock())
    },
    editBlock: (content, index) => {
      dispatch(editBlock(content, index))
    },
    createProject: (title, content, history) => {
      dispatch(createProject(title, content, history))
    },
    getProject: id => {
      dispatch(getProject(id))
    },
    selectNote: id => {
      dispatch(selectNote(id))
    },
    saveProject: (id, title, content) => {
      dispatch(saveProject(id, title, content))
    },
    editTitle: title => {
      dispatch(editTitle(title))
    },
    clearEditor: () => {
      dispatch(clearEditor())
    },
    clearNote: () => {
      dispatch(clearNote())
    },
    deleteConfirm: () => {
      dispatch(deletePopup())
    },
    deleteNote: id => {
      dispatch(deleteNote(id))
    },
    closeModal: () => {
      dispatch(turnOffModal())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
