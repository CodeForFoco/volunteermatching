import React, { Component } from 'react';
import axios from 'axios';
import './SelectOneSearch.scss';

export default class SelectOneSearch extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    
    this.state = {
      options: [],
      loading: true,
      hide: true,
      error: false,
      keyDownCount: 0,
      myValue: ''
    }
  }

  getOptions() {
    const endpoint = this.props.getOptions.endpoint;
    const { myValue } = this.state;
    axios.get(`${endpoint}?search=${myValue}`)
      .then(res => {
        if (!this._isMounted) return;
        this.setState({
          options: res.data.items.map(item => {
            return item[this.props.getOptions.property];
          }), loading: false });
      })
      .catch(err => {
        this.setState({ error: true, loading: false });
      });
  }

  validOption() {
    return false;
  }

  updateSearch(e) {
    this.setState({ myValue: e.target.value, loading: true });
    const keyDownCount = this.state.keyDownCount + 1;
    this.setState({ keyDownCount }, () => {
      window.setTimeout(() => {
        if (keyDownCount === this.state.keyDownCount) {
          const myValue = this.state.myValue;
          if (myValue && myValue !== '') this.getOptions();
        }
      }, 500);
    });
  }

  selectOption(e) {
    this.props.setValue({ [this.props.name]: e.target.value });
    this.setState({ hide: true, myValue: e.target.value });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render () {
    const { label, name, value } = this.props;
    const { options, hide, loading, error, myValue } = this.state;
    const noResults = this.state.options.length < 0 && myValue !== '' ? true : false;
    const errMessage = noResults ? 'No Results' : '';

    return (
      <div className="form-group">
        <label>{label || name}</label>
        <div className="select-one-search-input-wrap">
          {hide && value ? (
            <div
              className="form-control select-one-search-overlay"
              onClick={() => { this.setState({ hide: false }, () => {
                if (myValue && myValue !== '' && !value) this.getOptions();
              })}}
            >
              {value || `Search ${label || name}s`}
            </div>
          ) : ''}
            <input
              className="form-control"
              type="text"
              placeholder={`Search ${label || name}s`}
              onChange={this.updateSearch.bind(this)}
              value={myValue}
              onClick={() => { this.setState({ hide: false }, () => {
                if (myValue && myValue !== '' && !value) this.getOptions();
              })}}
            />
          {!hide && myValue && myValue !== '' ? (
            <div className="select-one-search-results">
              {error ? 'Search Error. Please retry.' : loading ? 'Loading...' : !options || options.length === 0 ? 'No Results' : options.map(option => {
                return (
                  <button 
                    key={(label || name) + option} 
                    className="btn btn-secondary text-left"
                    value={option}
                    onClick={this.selectOption.bind(this)}>
                    {option}
                  </button>
                );
              })}
            </div>
          ): ''}
        </div>
        <p className="text-danger">{errMessage}</p>
      </div>
    );
  }
}
