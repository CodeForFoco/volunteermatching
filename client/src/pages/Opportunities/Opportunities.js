import React, { Component } from 'react';
import Wrap from '../../components/Wrap/Wrap.js';
import Thumb from '../../components/OppThumb/OppThumb.js';
import SearchBar from '../../components/SearchBar/SearchBar.js';
import Alert from '../../components/Alert/Alert.js';
import Pagination from '../../components/Pagination/Pagination';
import './Opportunity.scss';
import axios from 'axios';

export default class Opportunties extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResult: {},
      searchError: {},
      page: 1,
      per_page: 10,
      search: '',
    }
  }

  search(e) {
    if (e && e.preventDefault) e.preventDefault();
    const { search, page, per_page } = this.state;
    axios.get(`/api/opportunities?search=${search}&page=${page}&per_page=${per_page}`)
    .then(res => {
      this.setState({ searchResult: res.data });
    })
    .catch(err => {
      this.setState({ searchError: {
        text: err.response.status + ' ' + err.response.statusText,
        type: 'alert-danger'
      }});
    });
  }

  setValue(obj, cb) {
    this.setState(obj, cb);
  }

  deleteOne(index) {
    let searchResult = this.state.searchResult;
    let id = searchResult.items[index].id;
    axios.delete(`/api/opportunities/${id}`)
      .then(res => {
        searchResult.items.splice(index, 1);
        this.setState({ searchResult });
      })
      .catch(err => {
        alert('Delete Failed. Please try again.');
      });
  }

  componentDidMount() {
    this.search();
  }

  render () {
    const items = this.state.searchResult ? this.state.searchResult.items : [];

    return (
      <Wrap {...this.props}>
        <h2>Search Opportunities</h2>
        <SearchBar
          endpoint='opportunities'
          setValue={this.setValue.bind(this)}
          search={this.state.search}
          submitSearch={this.search.bind(this)}
          postUrl="/opportunities/post"
        />
        <Alert {...this.state.searchError}/>
        <br/><br/>
        {items && items.length > 0 ? items.map((val, i) => {
          return (
            <Thumb
              {...val}
              key={'thumb-' + i}
              deleteOne={() => { this.deleteOne(i) }}
            />
          );
        }): 
        <p className="text-danger">No Opportunities found.</p>}
        <Pagination
          {...this.state}
          setValue={this.setValue.bind(this)}
          search={this.search.bind(this)}
        />
      </Wrap>
    );
  }
}