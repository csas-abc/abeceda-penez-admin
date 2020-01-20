import React from 'react';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import classroomAttributes from '../constants/classroomAttributes';

const Projects = ({ classroomsQuery }) => (
    <Layout title="Přehled">
        <ProjectsTable query={classroomsQuery} dataSelector={prop('classrooms')} />
    </Layout>
);

const classroomsQuery = graphql(gql`
    {
        classrooms {
            ${classroomAttributes}
        }
    }
`, {
    name: 'classroomsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default classroomsQuery(Projects);
