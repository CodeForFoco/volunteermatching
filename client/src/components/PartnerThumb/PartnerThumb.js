import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './PartnerThumb.scss';

export default class PartnerThumb extends Component {
  render () {
    const { id } = this.props;
    return (
      <div className='opp-thumb'>
        <h4>{this.props.name} | {this.props.opportunity_count} Opps</h4>
        <div className="btn-group">
          {/*<Link className="btn btn-info btn-sm" to={`/partners/view/${id}`}>View</Link>
          */}
          <Link className="btn btn-warning btn-sm" to={`/partners/edit/${id}`}>Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={this.props.deleteOne.bind(this)}>Delete</button>
        </div>
      </div>
    );
  }
}