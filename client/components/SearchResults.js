import React, {Component} from 'react'
import {ReactiveBase, ReactiveList} from '@appbaseio/reactivesearch'
import {withRouter} from 'react-router'
import {SearchBar} from './../components'
import ReactHtmlParser from 'react-html-parser'
import LoadingOverlay from 'react-loading-overlay'
class SearchResults extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: '#0f2027',
            padding: '4em'
          }}
        >
          <ReactiveBase app="notes" url={`${window.location.origin}/api/es`}>
            <SearchBar />
            <ReactiveList
              style={{margin: '1em', fontSize: '20px'}}
              componentId="searchResults"
              dataField="title"
              URLParams={true}
              loader={
                <LoadingOverlay
                  active={true}
                  spinner={
                    <img src="/loader.png" className="cosmonoteLoader" />
                  }
                />
              }
              onData={res => {
                return (
                  <div
                    className="reactivelist"
                    key={res.id}
                    onClick={() => this.props.history.push(`/notes/${res.id}`)}
                  >
                    {res.highlight && res.highlight.title
                      ? ReactHtmlParser(res.highlight.title)
                      : res.title}:
                    <br />
                    <br />
                    <div>
                      {res.highlight && res.highlight['content.cells.content']
                        ? ReactHtmlParser(
                            res.highlight['content.cells.content']
                          )
                        : res.content.cells[0]
                          ? res.content.cells[0].content
                          : ''}
                    </div>
                  </div>
                )
              }}
              react={{
                and: 'q'
              }}
            />
          </ReactiveBase>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(SearchResults)
