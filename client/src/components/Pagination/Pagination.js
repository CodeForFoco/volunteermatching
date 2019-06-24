import React, { Component } from 'react';

export default class Pagination extends Component {
  hasNextPage() {
    let nextPage = this.props.page + 1;
    const { searchResult } = this.props;
    if (searchResult && searchResult._meta && searchResult._meta.total_pages) {
      if (nextPage <= searchResult._meta.total_pages) {
        return true;
      }
    }
  }

  hasLastPage() {
    const lastPage = this.props.page - 1;
    if (lastPage > 0) {
      return true;
    }
  }

  nextPage() {
    const nextPage = this.props.page + 1;
    if (this.hasNextPage()) {
      this.props.setValue({ page: nextPage}, this.props.search.bind(this));
    }
  }

  lastPage() {
    const lastPage = this.props.page - 1;
    if (this.hasLastPage()) {
      this.props.setValue({ page: lastPage }, this.props.search.bind(this));
    }
  }

  render () {
    const { searchResult } = this.props;
    const totalPages = searchResult && searchResult._meta ? searchResult._meta.total_pages : '?';
    const totalItems = searchResult && searchResult._meta ? searchResult._meta.total_items: '?';
    return (
      <>
        <nav className="text-center row justify-content-center">
          <ul className="pagination">
            <li className="page-item">
              <button className={`btn btn-${this.hasLastPage() ? 'info': 'primary'}`} disabled={!this.hasLastPage()} onClick={this.lastPage.bind(this)}>
                <span aria-hidden="true">&laquo; </span>
                <span className=""> Last</span>
              </button>
            </li>
            <li className="page-item">
              <button className="btn btn-info" disabled>{`${this.props.page} of ${totalPages}`}</button>
            </li>
            <li className="page-item">
              <button className={`btn btn-${this.hasNextPage() ? 'info': 'primary'}`} disabled={!this.hasNextPage()} onClick={this.nextPage.bind(this)}>
                <span>Next </span>
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
        <p className="text-center">Found {totalItems} matches.</p>
      </>
    );
  }
}