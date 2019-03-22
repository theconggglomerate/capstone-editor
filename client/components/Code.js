import React, {Component} from 'react'
import Embed from 'react-runkit'
import LoadingOverlay from 'react-loading-overlay'
import {Button} from 'semantic-ui-react'
class Code extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      overlay: 'overlayInit',
      height: 'px'
    }
    this.toggleLoadedStatus = this.toggleLoadedStatus.bind(this)
  }

  toggleLoadedStatus() {
    const lines = this.props.source.split(/\r\n|\r|\n/).length
    console.log('source', lines)
    const height = lines * 21 + 'px'
    this.setState({...this.state, loaded: true, height})
  }
  runCode = () => {
    console.log(this.refs.embed)
    this.refs.embed.evaluate()
  }
  toggleOverlay() {
    this.setState({...this.state, overlay: 'overlayRan'})
  }
  render() {
    const height = this.props.source.split(/\r\n|\r|\n/).length * 21 + 18 + 'px'
    return (
      <LoadingOverlay
        active={!this.state.loaded}
        spinner={true}
        className="loading"
      >
        <div className="overlayInit" style={{height: height}} />

        <Embed
          source={this.props.source}
          onLoad={() => this.toggleLoadedStatus()}
          onEvaluate={() => this.toggleOverlay()}
          ref="embed"
        />
      </LoadingOverlay>
    )
  }
}

export default Code
