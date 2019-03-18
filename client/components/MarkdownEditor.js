import React, {Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/jsx'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/markdown'
import 'brace/snippets/markdown'

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

const defaultValue = `# Hello
  * This
  * is
  * markdown`
class MarkdownEditor extends Component {
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
        </div>
        <div>
          <AceEditor
            mode="markdown"
            theme={this.state.theme}
            name="MarkdownEditor"
            onLoad={this.onLoad}
            onChange={this.onChange}
            onSelectionChange={this.onSelectionChange}
            onCursorChange={this.onCursorChange}
            onValidate={this.onValidate}
            value={this.state.value}
            fontSize={this.state.fontSize}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: false,
              enableSnippets: true,
              showLineNumbers: false,
              tabSize: 2
            }}
          />
        </div>
      </div>
    )
  }
}

export default MarkdownEditor
