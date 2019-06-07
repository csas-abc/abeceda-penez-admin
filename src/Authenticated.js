import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dashboard from './Dashboard';
import Users from './Users';
import Toolboxes from './Toolboxes';

const Authenticated = ({ client, history: { push } }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        client.query({
            query: meQUery,
            fetchPolicy: 'network-only',
        }).then(() => {
            setLoading(false);
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
            <Route path="/" exact component={Dashboard} />
            <Route path="/users" exact component={Users} />
            <Route path="/toolboxes" exact component={Toolboxes} />
        </Fragment>
    )
};

const meQUery = gql`
    {
        me {
            email,
        }
    }
`;

export default withRouter(withApollo(Authenticated));
