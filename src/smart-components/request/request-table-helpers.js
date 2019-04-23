import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';

export const createInitialRows = data => {
  console.log('CreateInitialRows data: : ', data);
  return data.reduce((acc, { id, requester, created_at, updated_at, active_stage, total_stages, state, decision, content }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      cells: [ <Fragment key={ id }><Link to={ `/requests/detail/${id}` }>
        <Button variant="link"> { id } </Button></Link></Fragment>, requester,
      timeAgo(created_at), timeAgo(updated_at), `${active_stage} of ${total_stages}`, decision ]
    }, {
      parent: key * 2,
      cells: [{ title: <ExpandableContent id={ id } content={ content } state={ state } active_stage={ active_stage }/> }]
    }
  ]), []);
};

