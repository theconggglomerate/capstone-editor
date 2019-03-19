import React, {Component} from 'react'
import {ReactiveBase, ResultList} from '@appbaseio/reactivesearch'
import {withRouter} from 'react-router'
import {SearchBar} from './../components'

class SearchResults extends Component {
  render() {
    return (
      <React.Fragment>
        <ReactiveBase app="notes" url="http://localhost:9200">
          <SearchBar />
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
