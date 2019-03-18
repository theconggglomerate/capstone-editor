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
          dataField={['title', 'content.cells.content']}
          highlight={true}
          highlightField={['title', 'content.cells.content']}
          customHighlight={props => ({
            highlight: {
              pre_tags: ['<strong>'],
              post_tags: ['</strong>'],
              fields: {
                title: {},
                'content.cells.content': {}
              }
            }
          })}
          onSuggestion={suggestion => {
            return {
              label: `${
                suggestion.highlight && suggestion.highlight.title
                  ? suggestion.highlight.title
                  : suggestion._source.title
              }${
                suggestion.highlight &&
                suggestion.highlight['content.cells.content']
                  ? `: ${suggestion.highlight['content.cells.content']}`
                  : ''
              }`,
              value: suggestion,
              source: suggestion._source
            }
          }}
          fuzziness={0}
          onValueSelected={(value, cause, source) => {
            if (cause === 'SUGGESTION_SELECT')
              this.props.history.push(`/notes/${source.id}`)
            if (cause === 'ENTER_PRESS') console.log(value)
          }}
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
