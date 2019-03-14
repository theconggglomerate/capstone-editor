import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {DataSearch} from '@appbaseio/reactivesearch'
class AllNotes extends Component {
  render() {
    const {allNotes} = this.props
    return allNotes && allNotes.length ? (
      <div>
        <DataSearch
          componentId="noteSearch"
          dataField={['title']}
          onValueSelected={(value, cause, source) =>
            this.props.history.push(`/notes/${source.id}`)
          }
        />
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
