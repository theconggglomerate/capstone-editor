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
  saveProject,
  editTitle,
  clearEditor
} from './../store'

export class Editor extends Component {
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

  refresh = () => {
    const noteId = this.props.match.params.noteId

    if (noteId === 'new') {
      this.props.clearEditor()
    } else if (noteId) {
      this.props.getProject(noteId)
    }
  }

  componentDidMount = () => {
    this.refresh()
  }

  componentDidUpdate = prevProps => {
    if (prevProps.match.params.noteId !== this.props.match.params.noteId) {
      this.refresh()
    }
  }

  new = () => {
    this.props.history.push('/editor/new')
  }

  save = () => {
    if (
      (this.props.match.params.noteId &&
        this.props.match.params.noteId !== 'new') ||
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
  }
  handleTitle = event => {
    event.preventDefault()
    const title = event.target.value
    this.props.editTitle(title)
  }
  handleChange = (newValue, idx) => {
    this.props.editBlock(newValue, idx)
  }

  newCode = () => {
    this.props.makeNewCodeBlock()
  }

  newMarkdown = () => {
    this.props.makeNewMarkdownBlock()
  }

  render() {
    return (
      <div>
        <div className="split left">
          <div>
            <button onClick={this.newCode}>New Code Block</button>
            <button onClick={this.newMarkdown}> New Markdown Block </button>
            <button onClick={this.save}> Save Note</button>
            <button onClick={this.new}> New Note</button>
            <input
              type="text"
              onChange={this.handleTitle}
              value={this.props.editor.title}
              placeholder="Enter title here"
            />
          </div>

          <div>
            {this.props.editor.cells
              ? this.props.editor.cells.map((cell, idx) => {
                  return cell.type === 'code' ? (
                    <div>
                      <AceEditor
                        mode="javascript"
                        theme={this.state.theme}
                        name="CodeEditor"
                        onChange={value => this.handleChange(value, idx)}
                        key={idx + 'edcd'}
                        value={this.props.editor.cells[idx].content}
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
                        value={this.props.editor.cells[idx].content}
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
        {this.props.editor.cells ? (
          <div className="split right">
            <h1>{this.props.editor.title}</h1>
            {this.props.editor.cells.map((cell, idx) => {
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
    editor: state.editor
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
