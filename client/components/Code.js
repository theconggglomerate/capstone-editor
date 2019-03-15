import React, {Component} from 'react'
import Embed from 'react-runkit'
import LoadingOverlay from 'react-loading-overlay'
class Code extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false
    }
  }

  toggleLoadedStatus() {
    this.setState({loaded: true})
  }

  render() {
    return (
      <LoadingOverlay active={!this.state.loaded} spinner={true}>
        <Embed
          source={this.props.source}
          onLoad={() => this.toggleLoadedStatus()}
        />
      </LoadingOverlay>
    )
  }
}

export default Code
