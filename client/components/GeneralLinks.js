import React, {Component} from 'react'
import {connect} from 'react-redux'
import {selectNote} from './../store'
import {Link} from 'react-router-dom'
import {Button} from 'semantic-ui-react'

class GeneralLinks extends Component {
  constructor(props) {
    super()
  }
  componentDidMount() {
    const noteId = this.props.noteId
    this.props.selectNote(noteId)
  }
  render() {
    const {selectedNote} = this.props
    let associations = []
    if (selectedNote.id) {
      associations = selectedNote.source.concat(selectedNote.target)
    }

    console.log('ASSOCIATIONS', associations)
    return (
      <div>
        <h3>Search Bar!</h3>
        {associations.length
          ? associations.map(link => (
              <span>
                <Link key={link.id} to={`/notes/${link.id}`}>
                  {link.title}
                </Link>
                <br />
              </span>
            ))
          : ''}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  selectedNote: state.notes.selectedNote
})

const mapDispatchToProps = dispatch => ({
  selectNote: noteId => {
    dispatch(selectNote(noteId))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralLinks)
