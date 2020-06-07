import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import Teams from './screens/Teams';
import Users from './screens/Users';
import Toolboxes from './screens/Toolboxes';
import CoreToolboxes from './screens/CoreToolboxes';
import Projects from './screens/Projects';
import Archive from './screens/Archive';
import Statistics from './screens/Statistics';
import ClassroomsManagement from './screens/ClassroomsManagement';
import SecondGradesManagement from './screens/SecondGradesManagement';
import MAPManagement from './screens/MAPManagement';
import VAPManagement from './screens/VAPManagement';
import SeniorAPManagement from './screens/SeniorAPManagement';
import Forum from './screens/Forum';
import compose from 'ramda/src/compose';
import contains from 'ramda/src/contains';
import pluck from 'ramda/src/pluck';
import defaultTo from 'ramda/src/defaultTo';
import path from 'ramda/src/path';
import Fairs from './screens/Fairs';
import CoreFairs from './screens/CoreFairs';
import CoreRegionProjects from './screens/CoeRegionProjects';
import CoreProjects from './screens/CoreProjects';
import DeletedClassrooms from './screens/DeletedClassrooms';
import Roadmap from './screens/Roadmap';
import Budgets from './screens/Budgets';
import Schools from './screens/Schools';

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
    }, [client, push]);
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
            <Route path="/core-toolboxes" exact component={CoreToolboxes} />
            <Route path="/fairs" exact component={Fairs} />
            <Route path="/core-fairs" exact component={CoreFairs} />
            <Route path="/archive" exact component={Archive} />
            <Route path="/deleted" exact component={DeletedClassrooms} />
            <Route path="/classrooms-management" exact component={ClassroomsManagement} />
            <Route path="/second-grades-management" exact component={SecondGradesManagement} />
            <Route path="/map-management" exact component={MAPManagement} />
            <Route path="/vap-management" exact component={VAPManagement} />
            <Route path="/senior-ap-management" exact component={SeniorAPManagement} />
            <Route path="/forum" exact component={Forum} />
            <Route path="/statistics" exact component={Statistics} />
            <Route path="/core-region/:region" exact component={CoreRegionProjects} />
            <Route path="/roadmap" exact component={Roadmap} />
            <Route path="/budgets" exact component={Budgets} />
            <Route path="/schools" exact component={Schools} />
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
