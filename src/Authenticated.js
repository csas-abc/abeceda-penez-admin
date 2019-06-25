import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dashboard from './Dashboard';
import Users from './Users';
import Toolboxes from './Toolboxes';
import Projects from './Projects';
import compose from 'ramda/src/compose';
import contains from 'ramda/src/contains';
import pluck from 'ramda/src/pluck';
import defaultTo from 'ramda/src/defaultTo';
import path from 'ramda/src/path';
import Fairs from './Fairs';

const Authenticated = ({ client, history: { push } }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        client.query({
            query: meQUery,
            fetchPolicy: 'network-only',
        }).then((res) => {
            setLoading(false);
            if (compose(
                contains('AGENCY'),
                pluck('name'),
                defaultTo([]),
                path(['data', 'me', 'roles']),
            )(res)) {
                push('/toolboxes');
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
            <Route path="/teams" exact component={Dashboard} />
            <Route path="/users" exact component={Users} />
            <Route path="/toolboxes" exact component={Toolboxes} />
            <Route path="/fairs" exact component={Fairs} />
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
