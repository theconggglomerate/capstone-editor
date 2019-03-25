import React, {Component} from 'react'
import {ReactiveBase, ReactiveList} from '@appbaseio/reactivesearch'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {SearchBar} from './../components'
import ReactHtmlParser from 'react-html-parser'
import {Search} from 'brace/ext/searchbox'

class SearchResults extends Component {
  render() {
    return (
      <React.Fragment>
        <div style={{padding: '3em', backgroundColor: '#0f2027'}}>
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
                  <React.Fragment>
                    <div
                      className="reactivelist"
                      key={res.id}
                      onClick={() =>
                        this.props.history.push(`/notes/${res.id}`)
                      }
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
                    </div>
                  </React.Fragment>
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
