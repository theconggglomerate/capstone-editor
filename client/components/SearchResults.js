import React, {Component} from 'react'
import {ReactiveBase, ReactiveList} from '@appbaseio/reactivesearch'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {SearchBar} from './../components'
import ReactHtmlParser from 'react-html-parser'

class SearchResults extends Component {
  render() {
    return (
      <React.Fragment>
        <div style={{margin: '3em'}}>
          <ReactiveBase app="notes" url={`${window.location.origin}/api/es`}>
            <SearchBar />
            <ReactiveList
              style={{margin: '2em'}}
              componentId="searchResults"
              dataField="title"
              URLParams={true}
              loader="Loading Results.."
              onData={res => {
                return (
                  <div
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
                        : res.content.cells[0].content}
                    </div>
                    <hr />
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
