import React from 'react';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import classroomAttributes from '../constants/classroomAttributes';

const Archive = ({ archiveQuery }) => (
    <Layout title="Archiv">
        <ProjectsTable query={archiveQuery} dataSelector={prop('archive')} />
    </Layout>
);

const archiveQuery = graphql(gql`
    {
        archive {
            ${classroomAttributes}
        }
    }
`, {
    name: 'archiveQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default archiveQuery(Archive);
