import React from 'react';
import Layout from '../components/Layout';
import { graphql } from 'react-apollo';
import gql from "graphql-tag";
import classroomAttributes from '../constants/classroomAttributes';
import ProjectsTable from '../components/ProjectsTable';
import prop from 'ramda/src/prop';

const VAPProjects = ({ classrooms }) => (
    <Layout title="VAP">
        <ProjectsTable query={classrooms} dataSelector={prop('classrooms')} />
    </Layout>
);

const vapClassroomsQuery = graphql(gql`
    {
        classrooms(projectType: VAP) {
            ${classroomAttributes}
        }
    }
`, {
    name: 'classrooms',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default vapClassroomsQuery(VAPProjects);
