import React, {Component} from 'react'
import {
  Button,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar
} from 'semantic-ui-react'

export default class SidebarExampleDimmed extends Component {
  state = {visible: false}

  handleShowClick = () => this.setState({visible: !this.state.visible})
  handleSidebarHide = () => this.setState({visible: false})

  render() {
    const {visible} = this.state

    return (
      <div>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={visible}
          width="thin"
        >
          <Menu.Item as="a">
            <Icon name="home" />
            Home
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="gamepad" />
            Games
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="camera" />
            Channels
          </Menu.Item>
        </Sidebar>
      </div>
    )
  }
}
