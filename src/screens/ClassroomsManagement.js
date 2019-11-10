import React, { useState } from 'react';
import prop from 'ramda/src/prop';
import propOr from 'ramda/src/propOr';
import find from 'ramda/src/find';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import classroomAttributes from '../constants/classroomAttributes';
import CreateClassroomModal from '../components/CreateClassroomModal';

const ClassroomManagement = ({ myClassroomsQuery }) => {
    const [createClassroomForm, setCreateClassroomForm] = useState(false);
    const [lastCreatedClassroomId, setLastCreatedClassroomId] = useState(null);
    return (
        <Layout title="Třídy">
            {createClassroomForm ? (
                <CreateClassroomModal
                    onClose={(classroomId) => {
                        setCreateClassroomForm(false);
                        myClassroomsQuery.refetch().then(() => {
                            setLastCreatedClassroomId(classroomId);
                        })
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
            <ProjectsTable
                query={myClassroomsQuery}
                dataSelector={prop('myClassrooms')}
                defaultDetail={find((classroom) => classroom.id === lastCreatedClassroomId)(propOr([], 'myClassrooms')(myClassroomsQuery))}
            />
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
