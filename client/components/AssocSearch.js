import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {DataSearch} from '@appbaseio/reactivesearch'
class AssocSearch extends Component {
  render() {
    return (
      <DataSearch
        style={{width: '40%'}}
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
            value: suggestion._source.title,
            source: suggestion._source
          }
        }}
        onValueSelected={(value, cause, source) => {
          if (cause === 'SUGGESTION_SELECT')
            this.props.makeAssociation(source.id)
          //   if (cause === 'ENTER_PRESS')
          //     return;
        }}
      />
    )
  }
}

export default AssocSearch
