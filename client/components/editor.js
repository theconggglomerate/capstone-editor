import React, {Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/jsx'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/markdown'
import 'brace/snippets/markdown'
import ReactMarkdown from 'react-markdown'
import {Code} from './../components/'
import {connect} from 'react-redux'
import {
  selectNote,
  makeCodeBlock,
  makeMarkdownBlock,
  editBlock,
  getProject,
  createProject,
  saveProject
} from './../store'

export class editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      cells: [],
      theme: 'monokai',
      enableLiveAutocompletion: true,
      fontSize: 14,
      currentIdx: 0
    }
  }

  componentDidMount = () => {
    const noteId = this.props.match.params.noteId
    if (noteId) {
      this.props.getProject(noteId)
      this.props.selectNote(noteId)
    }
  }

  save = () => {
    if (this.props.match.params.noteId) {
      this.props.saveProject(
        this.props.match.params.noteId,
        this.state.title || this.props.selectedNote.title,
        this.props.editor
      )
    } else {
      this.props.createProject(
        this.state.title,
        this.props.editor,
        this.props.history
      )
    }
  }
  handleTitle = event => {
    event.preventDefault()
    const title = event.target.value
    this.setState({...this.state, title})
  }
  handleChange = (newValue, idx) => {
    this.props.editBlock(newValue, idx)
    // event.preventDefault()
    // const blockCells = this.state.cells.slice()
    // blockCells[idx].content = newValue
    // this.setState({...this.state, cells: blockCells})
  }

  newCode = () => {
    this.props.makeNewCodeBlock()
    // const blockCells = this.state.cells.slice()
    // blockCells.push({type: 'code', content: ''})
    // this.setState({...this.state, cells: blockCells})
  }

  newMarkdown = () => {
    this.props.makeNewMarkdownBlock()
    //     const blockCells = this.state.cells.slice()
    //     blockCells.push({type: 'markdown', content: ''})
    //     this.setState({...this.state, cells: blockCells})
  }

  render() {
    let selectedNote = {}
    if (this.props.selectedNote && this.props.match.params.noteId) {
      selectedNote = {
        title: this.props.selectedNote.title,
        content: {cells: this.props.editor}
      }
    } else {
      selectedNote = {
        title: this.state.title,
        content: {cells: this.props.editor}
      }
    }

    return (
      <div>
        <div className="split left">
          <div>
            <button onClick={this.newCode}>New Code Block</button>
            <button onClick={this.newMarkdown}> New Markdown Block </button>
            <button onClick={this.save}> Save Note</button>
            <input
              type="text"
              onChange={this.handleTitle}
              value={this.state.value}
              placeholder="Enter title here"
            />
          </div>

          <div>
            {this.props.editor
              ? this.props.editor.map((cell, idx) => {
                  return cell.type === 'code' ? (
                    <div>
                      <AceEditor
                        mode="javascript"
                        theme={this.state.theme}
                        name="CodeEditor"
                        onChange={value => this.handleChange(value, idx)}
                        key={idx + 'edcd'}
                        value={this.props.editor[idx].content}
                        fontSize={this.state.fontSize}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                          enableBasicAutocompletion: true,
                          enableLiveAutocompletion: this.state
                            .enableLiveAutocompletion,
                          enableSnippets: true,
                          showLineNumbers: true,
                          tabSize: 2,
                          maxLines: 100,
                          minLines: 3
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <AceEditor
                        mode="markdown"
                        theme="tomorrow"
                        name="MarkdownEditor"
                        onChange={value => this.handleChange(value, idx)}
                        key={idx + 'edmd'}
                        value={this.props.editor[idx].content}
                        fontSize={this.state.fontSize}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                          enableBasicAutocompletion: true,
                          enableLiveAutocompletion: this.state
                            .enableLiveAutocompletion,
                          enableSnippets: true,
                          showLineNumbers: true,
                          tabSize: 2,
                          maxLines: 100,
                          minLines: 3
                        }}
                      />
                    </div>
                  )
                })
              : ''}
          </div>
        </div>
        {this.props.editor ? (
          <div className="split right">
            <h1>{selectedNote.title}</h1>
            {selectedNote.content.cells.map((cell, idx) => {
              if (cell.type === 'markdown') {
                return <ReactMarkdown key={idx + 'md'} source={cell.content} />
              }
              if (cell.type === 'code') {
                return <Code key={idx + 'cd'} source={cell.content} />
              }
            })}
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    editor: state.editor,
    selectedNote: state.notes.selectedNote
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(editor)
