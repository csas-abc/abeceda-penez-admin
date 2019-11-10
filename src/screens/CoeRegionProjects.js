import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';
import prop from 'ramda/src/prop';
import Layout from '../components/Layout';
import classroomAttributes from '../constants/classroomAttributes';
import ProjectsTable from '../components/ProjectsTable';

const CoreRegionProjects = ({ match, coreClassroomsQuery }) => {
    return (
        <Layout title={`Třídy z regionu ${path(['params', 'region'])(match)}`}>
            <ProjectsTable
                query={coreClassroomsQuery}
                dataSelector={prop('coreClassrooms')}
            />
        </Layout>
    );
};

const coreRegionClassrooms = graphql(gql`
    query CoreClassrooms($region: String!){
        coreClassrooms(region: $region) {
            ${classroomAttributes}
        }
    }
`, {
    name: 'coreClassroomsQuery',
    options: (props) => ({
        fetchPolicy: 'cache-and-network',
        variables: {
            region: pathOr('-', ['match', 'params', 'region'])(props)
        }
    })
});

export default coreRegionClassrooms(CoreRegionProjects);
