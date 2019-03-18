import React, {Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/jsx'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/javascript'
import 'brace/snippets/javascript'

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal'
]

themes.forEach(theme => {
  require(`brace/theme/${theme}`)
})

const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`
class CodeEditor extends Component {
  onChange(newValue) {
    this.setState({
      value: newValue
    })
  }

  setTheme(e) {
    this.setState({
      theme: e.target.value
    })
  }

  setBoolean(name, value) {
    this.setState({
      [name]: value
    })
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value, 10)
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      value: defaultValue,
      theme: 'monokai',
      enableLiveAutocompletion: false,
      fontSize: 14
    }
    this.setTheme = this.setTheme.bind(this)
    this.onChange = this.onChange.bind(this)
    this.setFontSize = this.setFontSize.bind(this)
    this.setBoolean = this.setBoolean.bind(this)
  }
  render() {
    return (
      <div>
        <div>
          <div>
            <label>Theme:</label>
            <select
              name="Theme"
              onChange={this.setTheme}
              value={this.state.theme}
            >
              {themes.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Font Size:</label>
            <select
              name="Font Size"
              onChange={this.setFontSize}
              value={this.state.fontSize}
            >
              {[14, 16, 18, 20, 24, 28, 32, 40].map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={this.state.enableLiveAutocompletion}
                onChange={e =>
                  this.setBoolean('enableLiveAutocompletion', e.target.checked)
                }
              />
              Enable Live Autocomplete
            </label>
          </div>
        </div>
        <div>
          <AceEditor
            mode="javascript"
            theme={this.state.theme}
            name="CodeEditor"
            onLoad={this.onLoad}
            onChange={this.onChange}
            onSelectionChange={this.onSelectionChange}
            onCursorChange={this.onCursorChange}
            onValidate={this.onValidate}
            value={this.state.value}
            fontSize={this.state.fontSize}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: this.state.enableLiveAutocompletion,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </div>
      </div>
    )
  }
}

export default CodeEditor
