import React, {Component} from 'react'
import {ReactiveBase, DataSearch, ResultList} from '@appbaseio/reactivesearch'
import {withRouter} from 'react-router'

class SearchResults extends Component {
  render() {
    return (
      <React.Fragment>
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
            URLParams={true}
            onValueSelected={(value, cause, source) => {
              if (cause === 'SUGGESTION_SELECT')
                this.props.history.push(`/notes/${source.id}`)
              if (cause === 'ENTER_PRESS') {
                this.props.history.push(`/search?q="${value}"`)
              }
            }}
          />
          <ResultList
            componentId="searchResults"
            dataField="title"
            URLParams={true}
            onData={res => ({title: res.title})}
            react={{
              and: 'q'
            }}
          />
        </ReactiveBase>
      </React.Fragment>
    )
  }
}

export default withRouter(SearchResults)
