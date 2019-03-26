import React, {Component} from 'react'
import AceEditor from 'react-ace'
import Code from './Code'
import {Button} from 'semantic-ui-react'
import 'brace/theme/cobalt'
class CodeDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      runkit: false,
      theme: 'cobalt',
      fontSize: 14,
      result: null
    }
  }

  toggleRunkitStatus = () => {
    this.setState({runkit: !this.state.runkit})
  }

  runCode = () => {
    const result = eval(this.props.source)
    this.setState({...this.state, result})
  }

  render() {
    return !this.state.runkit ? (
      <>
        {' '}
        <AceEditor
          mode="javascript"
          theme={this.state.theme}
          name="CodeEditor"
          onChange={value => this.handleChange(value, idx)}
          key={this.props.keyr}
          value={this.props.source}
          fontSize={this.state.fontSize}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          editorProps={{$blockScrolling: Infinity}}
          width="100%"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: this.state.enableLiveAutocompletion,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            maxLines: 100,
            minLines: 3,
            wrap: true,
            readOnly: true
          }}
        />
        {window.location.pathname.includes('/visual') ? (
          <Button
            style={{margin: '1em 1em 1em 80%'}}
            onClick={this.toggleRunkitStatus}
            color="facebook"
          >
            Make Runnable
          </Button>
        ) : (
          <Button
            style={{margin: '1em 1em 1em 80%'}}
            onClick={this.toggleRunkitStatus}
            inverted={true}
          >
            Make Runnable
          </Button>
        )}
        {this.state.result ? <h3>{this.state.result}</h3> : ''}
      </>
    ) : (
      <Code key={this.props.key} source={this.props.source} />
    )
  }
}

export default CodeDisplay
