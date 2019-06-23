import React, { Component } from 'react';
import axios from 'axios';

export default class Select extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    
    this.state = {
      options: []
    }
  }

  getOptions() {
    axios.get(this.props.getOptions.endpoint)
      .then(res => {
        if (!this._isMounted) return;
        this.setState({
          options: res.data.items.map(item => {
            return item[this.props.getOptions.property];
          })}, () => {
          this.props.setValue({ [this.props.name]: this.state.options[0] });
        });
      });
  }

  componentDidMount() {
    this._isMounted = true;
    if (!this.props.options && this.props.getOptions) {
      this.getOptions();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render () {
    const { label, name } = this.props;
    const options = this.state.options.length > 0 ? this.state.options : this.props.options;

    return (
      <div className="form-group">
        <label>{label || name}</label>
        <select
          className="form-control"
          name={name} 
          onChange={(e) => { this.props.setValue({ [e.target.name]: e.target.value })}}>
          {options ? options.map(name => {
            return <option key={`option-${name}`} value={name}>{name}</option>
          }) : ''}
        </select>
      </div>
    );
  }
}