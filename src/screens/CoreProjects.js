import React from 'react';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import classroomAttributes from '../constants/classroomAttributes';

const CoreProjects = ({ coreClassrooms }) => (
    <Layout title="Přehled RMKT">
        <ProjectsTable query={coreClassrooms} dataSelector={prop('coreClassrooms')} />
    </Layout>
);

const coreClassroomsQuery = graphql(gql`
    {
        coreClassrooms {
            ${classroomAttributes}
        }
    }
`, {
    name: 'coreClassrooms',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default coreClassroomsQuery(CoreProjects);
