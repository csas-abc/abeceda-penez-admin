import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import Teams from './screens/Teams';
import Users from './screens/Users';
import Toolboxes from './screens/Toolboxes';
import Projects from './screens/Projects';
import Archive from './screens/Archive';
import Statistics from './screens/Statistics';
import ClassroomsManagement from './screens/ClassroomsManagement';
import Forum from './screens/Forum';
import compose from 'ramda/src/compose';
import contains from 'ramda/src/contains';
import pluck from 'ramda/src/pluck';
import defaultTo from 'ramda/src/defaultTo';
import path from 'ramda/src/path';
import Fairs from './screens/Fairs';
import CoreRegionProjects from './screens/CoeRegionProjects';
import CoreProjects from './screens/CoreProjects';

const Authenticated = ({ client, history: { push } }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        client.query({
            query: meQUery,
            fetchPolicy: 'network-only',
        }).then((res) => {
            setLoading(false);
            if (compose(
                contains('ADMIN'),
                pluck('name'),
                defaultTo([]),
                path(['data', 'me', 'roles']),
            )(res)) {
                return;
            }
            if (compose(
                contains('CORE_AGENCY'),
                pluck('name'),
                defaultTo([]),
                path(['data', 'me', 'roles']),
            )(res)) {
                push('/fairs');
                return;
            }
            if (compose(
                contains('AGENCY'),
                pluck('name'),
                defaultTo([]),
                path(['data', 'me', 'roles']),
            )(res)) {
                push('/toolboxes');
                return;
            }
            if (compose(
                contains('CORE'),
                pluck('name'),
                defaultTo([]),
                path(['data', 'me', 'roles']),
            )(res)) {
                push('/classrooms-management');
                return;
            }
        }).catch((e) => {
            setLoading(false);
            push('/login');
        });
    }, []);
    if (loading) return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </div>
    );
    return (
        <Fragment>
            <Route path="/" exact component={Projects} />
            <Route path="/core-projects" exact component={CoreProjects} />
            <Route path="/teams" exact component={Teams} />
            <Route path="/users" exact component={Users} />
            <Route path="/toolboxes" exact component={Toolboxes} />
            <Route path="/fairs" exact component={Fairs} />
            <Route path="/archive" exact component={Archive} />
            <Route path="/classrooms-management" exact component={ClassroomsManagement} />
            <Route path="/forum" exact component={Forum} />
            <Route path="/statistics" exact component={Statistics} />
            <Route path="/core-region/:region" exact component={CoreRegionProjects} />
        </Fragment>
    )
};

const meQUery = gql`
    {
        me {
            id
            email
            roles {
                name
            }
        }
    }
`;

export default withRouter(withApollo(Authenticated));
