import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import propOr from 'ramda/src/propOr';
import prop from 'ramda/src/prop';
import withStyles from '@material-ui/core/styles/withStyles';
import { withApollo } from "react-apollo";
import { graphql } from 'react-apollo';
import { useSnackbar } from 'notistack';
import gql from 'graphql-tag';
import schoolAttributes from '../constants/schoolAttributes';
import styled from "styled-components";
import SchoolDetail from "../components/SchoolDetail.component";
import SubmitButton from "../components/SubmitButton.component";
import classroomAttributes from "../constants/classroomAttributes";

const Buttons = styled.div`
position: absolute;
bottom: 0;
left: 0;
right: 0;
background-color: white;
display: flex;
padding: 10px 20px;
border-radius: 4px;
`
const classroomQuery = gql`
    query Classroom($id: ID!) {
        classroom(id: $id) {
            ${classroomAttributes}
        }
    }
`;

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const SchoolForms = ({ classes, changeClassroomSchool, classroom, editDisabled, client , createContactMutation, updateContactMutation }) => {

    const [school, setSchool] = useState(propOr({}, 'school')(classroom));
    const [name, setName] = useState(propOr({}, 'teacher')(classroom).name || '');
    const [email, setEmail] = useState(propOr({}, 'teacher')(classroom).email || '');
    const [phone, setPhone] = useState(propOr({}, 'teacher')(classroom).phone || '');
    const { enqueueSnackbar } = useSnackbar();
    const classroomId = prop('id')(classroom);
    return (
        <>
        <form
            className={classes.form}
        >

            <SchoolDetail
                classroom={classroom} school={school} setSchool={setSchool} name={name} email={email} phone={phone} setName={setName} setEmail={setEmail} setPhone={setPhone}
            />
            <Buttons>
                <SubmitButton
                    classes={classes} enqueueSnackbar={enqueueSnackbar} classroom={classroom} school={school} editDisabled={editDisabled} color="primary" value="Uložit školu" actionHandler={e => {
                        e.preventDefault();
                        changeClassroomSchool({
                            variables: {
                                id: classroom.id,
                                schoolId: school.id,
                            }
                        }).then(() => {
                            enqueueSnackbar(
                                'Projekt byl úspěšně uložen',
                                {
                                    variant: 'success',
                                    autoHideDuration: 4000,
                                    anchorOrigin: {
                                        horizontal: 'center',
                                        vertical: 'top',
                                    },
                                }
                            )
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                />
                <SubmitButton
                    classes={classes} enqueueSnackbar={enqueueSnackbar} classroom={classroom} school={school} editDisabled={editDisabled} color="primary" value="Uložit učitele" actionHandler={e => {
                        e.preventDefault();
                        const isCreate = !propOr({}, 'teacher')(classroom).id && classroomId;
                        const saveAction = isCreate ?
                            createContactMutation({
                                variables: {
                                    name,
                                    email,
                                    phone,
                                    classroomId,
                                    contactType: 'TEACHER',
                                }
                            }) :
                            updateContactMutation({
                                variables: {
                                    id: propOr({}, 'teacher')(classroom).id,
                                    name,
                                    email,
                                    phone,
                                }
                            });
                        saveAction.then(() => {
                            enqueueSnackbar(
                                'Kontakt byl úspěšně uložen',
                                {
                                    variant: 'success',
                                    autoHideDuration: 4000,
                                    anchorOrigin: {
                                        horizontal: 'center',
                                        vertical: 'top',
                                    },
                                }
                            )
                            if (isCreate) {
                                client.query({
                                    query: classroomQuery,
                                    fetchPolicy: 'network-only',
                                    variables: {
                                        id: classroomId,
                                    }
                                })
                            }
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                />
            </Buttons>
        </form>
            </>
    );
};

const changeClassroomSchool = graphql(
    gql`
        mutation ChangeClassroomSchool($id: ID!, $schoolId: ID!) {
            changeClassroomSchool(
                id: $id,
                schoolId: $schoolId,
            ) {
                id
                school {
                    ${schoolAttributes}
                }
            }
        }
    `,
    {
        name: 'changeClassroomSchool',
    },
);

const updateContactMutation = graphql(
    gql`
            mutation UpdateContact(
                $id: ID!
                $name: String
                $email: String
                $phone: String
            ) {
                updateContact(
                    data: {
                        id: $id
                        name: $name
                        email: $email
                        phone: $phone
                    }
                ) {
                    id
                    name
                    phone
                    email
                }
            }
        `,
        {
            name: 'updateContactMutation',
        },
    );

const createContactMutation = graphql(
        gql`
            mutation CreateContact(
                $name: String
                $email: String
                $phone: String
                $classroomId: ID!
                $contactType: String!
            ) {
                createContact(
                    data: {
                        name: $name
                        phone: $phone
                        email: $email
                        classroomId: $classroomId
                        contactType: $contactType
                    }
                ) {
                    id
                    name
                    phone
                    email
                }
            }
        `,
        {
            name: 'createContactMutation',
        },
    );

export default compose(
    withApollo,
    changeClassroomSchool,
    createContactMutation,
    updateContactMutation,
    withStyles(styles)
)(SchoolForms);
