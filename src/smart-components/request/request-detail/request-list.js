import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { DataList } from '@patternfly/react-core';
import { Request }  from './request';
import { DataListLoader } from '../../../presentational-components/shared/loader-placeholders';

class RequestList extends Component {
  state = {
    expanded: []
  };

  toggleExpand = id => this.setState(({ expanded }) => {
    const index = expanded.indexOf(id);
    const newExpanded =
      index >= 0 ? [ ...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length) ] : [ ...expanded, id ];
    return ({ expanded: newExpanded });
  });

  isExpanded = key => {
    return this.state.expanded.includes(key);
  };

  render() {
    return (
      <Fragment>
        <div>
          { this.props.isLoading && (
            <Fragment>
              <PageHeader>
                <PageHeaderTitle title={ this.props.noItems }/>
              </PageHeader>
              <DataListLoader/>
            </Fragment>
          ) }
        </div>
        { this.props.items.length > 0 && (
          <DataList aria-label="Expandable data list">
            { this.props.items.map((item, idx) => (
              <Request
                key={ item.id }
                item={ item }
                idx={ idx }
                isActive={ idx === 0 }
                isExpanded={ this.isExpanded(`request-${item.id}`) }
                toggleExpand={ this.toggleExpand }
              />)) }
          </DataList>)
        }
      </Fragment>
    );
  };
}

RequestList.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  noItems: PropTypes.string,
  active_request: PropTypes.number
};

RequestList.defaultProps = {
  items: []
};

export default RequestList;

