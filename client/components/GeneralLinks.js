import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote, deleteAssociation, makeAssociation} from './../store'
import {Link} from 'react-router-dom'
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  List
} from 'semantic-ui-react'
import AssocSearch from './AssocSearch'
import {ReactiveBase} from '@appbaseio/reactivesearch'
import Spacer from 'react-add-space'
class GeneralLinks extends Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }
  toggleVisible = () => {
    this.setState({...this.state, visible: !this.state.visible})
  }
  componentDidMount() {
    const noteId = this.props.noteId
    if (noteId && noteId !== 'new') {
      this.props.selectNote(noteId)
    }
  }
  createAssociation = targetId => {
    this.props.makeAssociation(this.props.noteId, targetId)
  }

  deleteAssociation(targetId) {
    const noteId = this.props.noteId
    console.log(noteId)
    this.props.deleteAssociation(noteId, targetId)
  }
  render() {
    const {selectedNote} = this.props
    const noteId = this.props.noteId
    let associations = []
    if (selectedNote && selectedNote.id) {
      associations = selectedNote.source.concat(selectedNote.target)
    }
    if (noteId && selectedNote) {
      return (
        <>
          <Button inverted={true} onClick={this.toggleVisible}>
            Show Associated Notes
          </Button>
          <Sidebar
            as={Menu}
            animation="push"
            direction="bottom"
            icon="labeled"
            visible={this.state.visible}
            width="thin"
          >
            <h3 style={{color: '#4286f4', padding: '2em 2em 3em 7em'}}>
              Search to Add Associations
            </h3>
            <div className="generalAssociations">
              <Grid>
                <Grid.Row columns="1">
                  <Grid.Column>
                    <ReactiveBase
                      app="notes"
                      url={`${window.location.origin}/api/es`}
                    >
                      <AssocSearch
                        noteId={this.props.noteId}
                        makeAssociation={this.createAssociation}
                      />
                    </ReactiveBase>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="1">
                  <Grid.Column>
                    <List>
                      {associations.length
                        ? associations.map(link => (
                            <List.Item key={link.id}>
                              <Grid columns={2}>
                                <Grid.Column textAlign="left">
                                  <Link to={`/notes/${link.id}`}>
                                    {link.title}
                                  </Link>{' '}
                                </Grid.Column>
                                <Grid.Column>
                                  <Button.Group floated="left">
                                    <Button
                                      negative
                                      onClick={() =>
                                        this.deleteAssociation(link.id)
                                      }
                                    >
                                      {' '}
                                      Delete association
                                    </Button>{' '}
                                    <Button.Or />{' '}
                                    <Button
                                      positive
                                      as="a"
                                      href={`/editor/${link.id}`}
                                    >
                                      Edit this note
                                    </Button>
                                  </Button.Group>
                                </Grid.Column>
                              </Grid>
                            </List.Item>
                          ))
                        : ''}
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            <Button
              style={{alignSelf: 'right', height: '3em', marginTop: '2%'}}
              onClick={this.toggleVisible}
            >
              Close Associations
            </Button>
          </Sidebar>
        </>
      )
    } else {
      return ''
    }
  }
}

const mapStateToProps = state => ({
  selectedNote: state.notes.selectedNote
})

const mapDispatchToProps = dispatch => ({
  selectNote: noteId => {
    dispatch(selectNote(noteId))
  },
  deleteAssociation: (sourceId, targetId) => {
    dispatch(deleteAssociation(sourceId, targetId))
  },
  makeAssociation: (sourceId, targetId) => {
    dispatch(makeAssociation(sourceId, targetId))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralLinks)
