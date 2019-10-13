import React, { useState } from 'react';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import classroomAttributes from '../constants/classroomAttributes';
import CreateClassroomModal from '../components/CreateClassroomModal';

const ClassroomManagement = ({ myClassroomsQuery }) => {
    const [createClassroomForm, setCreateClassroomForm] = useState(false);
    return (
        <Layout title="Správa tříd">
            {createClassroomForm ? (
                <CreateClassroomModal
                    onClose={() => {
                        setCreateClassroomForm(false);
                        myClassroomsQuery.refetch();
                    }}
                />
            ): null}
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px', marginLeft: '10px' }}
                onClick={() => {
                    setCreateClassroomForm(true);
                }}
            >
                Vytvořit třídu
            </Button>
            <ProjectsTable query={myClassroomsQuery} dataSelector={prop('myClassrooms')} />
        </Layout>
    );
};

const myClassroomsQuery = graphql(gql`
    {
        myClassrooms {
            ${classroomAttributes}
        }
    }
`, {
    name: 'myClassroomsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default myClassroomsQuery(ClassroomManagement);
