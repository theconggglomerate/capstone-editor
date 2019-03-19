import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {ReactiveBase, DataSearch} from '@appbaseio/reactivesearch'
class AllNotes extends Component {
  render() {
    const {allNotes} = this.props
    return allNotes && allNotes.length ? (
      <div>
        <ReactiveBase app="notes" url="http://localhost:9200">
          <DataSearch
            componentId="q"
            dataField={['title', 'content.cells.content']}
            highlight={true}
            highlightField={['title', 'content.cells.content']}
            customHighlight={props => ({
              highlight: {
                pre_tags: ['<b>'],
                post_tags: ['</b>'],
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
            onValueSelected={(value, cause, source) => {
              if (cause === 'SUGGESTION_SELECT')
                this.props.history.push(`/notes/${source.id}`)
              if (cause === 'ENTER_PRESS')
                this.props.history.push(`/search?q="${value}"`)
            }}
          />
        </ReactiveBase>
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
