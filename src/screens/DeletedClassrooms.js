import React from 'react';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import classroomAttributes from '../constants/classroomAttributes';

const DeletedClassroom = ({ deletedQuery }) => (
    <Layout title="Koš">
        <ProjectsTable query={deletedQuery} dataSelector={prop('deleted')} />
    </Layout>
);

const deletedQuery = graphql(gql`
    {
        deleted {
            ${classroomAttributes}
        }
    }
`, {
    name: 'deletedQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default deletedQuery(DeletedClassroom);
