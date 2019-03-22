import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote, deleteAssociation, makeAssociation} from './../store'
import {Link} from 'react-router-dom'
import {Button, Grid, List} from 'semantic-ui-react'
import AssocSearch from './AssocSearch'
import {ReactiveBase} from '@appbaseio/reactivesearch'

class GeneralLinks extends Component {
  constructor(props) {
    super()
  }
  componentDidMount() {
    const noteId = this.props.noteId
    this.props.selectNote(noteId)
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
    let associations = []
    if (selectedNote && selectedNote.id) {
      associations = selectedNote.source.concat(selectedNote.target)
    }
    if (selectedNote) {
      console.log('ASSOCIATIONS', associations)
      return (
        <Grid>
          <Grid.Row columns="1">
            <Grid.Column>
              <h3> Add Associations</h3>
              <ReactiveBase
                app="notes"
                url={`${window.location.origin}/api/es`}
              >
                <AssocSearch
                  noteId={this.props.noteId}
                  makeAssociation={this.createAssociation}
                />
              </ReactiveBase>
              <h3>Associated Notes</h3>
              <List>
                {associations.length
                  ? associations.map(link => (
                      <List.Item key={link.id}>
                        {' '}
                        <Link to={`/notes/${link.id}`}>{link.title}</Link>{' '}
                        <Button.Group>
                          <Button
                            negative
                            onClick={() => this.deleteAssociation(link.id)}
                          >
                            {' '}
                            Delete association
                          </Button>{' '}
                          <Button.Or />{' '}
                          <Button positive as="a" href={`/editor/${link.id}`}>
                            Edit this note
                          </Button>
                        </Button.Group>
                      </List.Item>
                    ))
                  : ''}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
