import React, { Fragment, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TextContent, Text, TextVariants, Level, LevelItem, Button, Bullseye, Spinner } from '@patternfly/react-core';
import { isApprovalApprover, isRequestStateActive } from '../../helpers/shared/helpers';
import { fetchRequestContent } from '../../helpers/request/request-helper';
import UserContext from '../../user-context';
import routes from '../../constants/routes';

export const ExpandedItem = ({ title = '', detail = '' }) => (
  <TextContent>
    <Text className="data-table-detail heading" component={ TextVariants.small }>{ title }</Text>
    <Text className="data-table-detail content" component={ TextVariants.h5 }>{ detail }</Text>
  </TextContent>
);

ExpandedItem.propTypes = {
  title: PropTypes.node,
  detail: PropTypes.node
};

const ExpandableContent = ({ id, number_of_children, state, reason }) => {
  const requestActive = isRequestStateActive(state) && !number_of_children;
  const [ requestContent, setRequestContent ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ fetchStarted, setIsFetching ] = useState(false);
  const { userPersona: userPersona } = useContext(UserContext);
  const expandedRequests = useSelector(({ requestReducer: { expandedRequests }}) => expandedRequests);

  useEffect(() => {
    if (!fetchStarted && isLoading && expandedRequests.includes(id)) {
      setIsFetching(true);
      fetchRequestContent(id).then((data) => { setRequestContent(data); setIsLoading(false); }).catch(() => setIsLoading(false));
    }
  }, [ expandedRequests ]);

  if (isLoading) {
    return (<Bullseye>
      <Spinner/>
    </Bullseye>);
  }

  return (
    <Fragment>
      <Level>
        <LevelItem>
          <ExpandedItem title="Product" detail={ requestContent ? requestContent.product : 'Unknown' } />
        </LevelItem>
        { requestActive && isApprovalApprover(userPersona) && <LevelItem>
          <Link to={ { pathname: routes.requests.approve, search: `request=${id}` } }  className="pf-u-mr-md">
            <Button variant="primary" aria-label="Approve Request" isDisabled={ !requestActive }>
              Approve
            </Button>
          </Link>
          <Link to={ { pathname: routes.requests.deny, search: `request=${id}` } }>
            <Button variant="danger" aria-label="Deny Request">
              Deny
            </Button>
          </Link>
        </LevelItem>
        }</Level>
      <Level>
        <LevelItem>
          <ExpandedItem title="Portfolio" detail={ requestContent ? requestContent.portfolio : 'Unknown' }/>
          <ExpandedItem title="Platform" detail={ requestContent ? requestContent.platform : 'Unknown' }/>
          <ExpandedItem title="Reason" detail={ reason ? reason : '' }/>
        </LevelItem>
      </Level>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.object,
  number_of_children: PropTypes.number,
  uname: PropTypes.string,
  state: PropTypes.string,
  reason: PropTypes.string
};

export default ExpandableContent;
