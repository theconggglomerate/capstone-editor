import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

class AllNotes extends Component {
  render() {
    const {allNotes} = this.props
    return allNotes && allNotes.length ? (
      <div>
        {allNotes.map(note => (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => this.props.history.push(`/notes/${note.id}`)}
              key={note.id}
            >
              {note.title}
            </button>
          </li>
        ))}
      </div>
    ) : (
      ''
    )
  }
}

const mapStateToProps = state => ({
  allNotes: state.notes.allNotes
})

export default withRouter(connect(mapStateToProps)(AllNotes))
