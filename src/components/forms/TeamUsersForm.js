import React, { useState } from 'react';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import { CircularProgress } from '@material-ui/core';
import CreateMessageModal from '../CreateMessageModal';
import SelectUnassignedUserModal from '../SelectUnassignedUserModal';
import includes from 'ramda/src/includes';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const TeamModal = ({
    userRoles,
    teamQuery: {
        team,
        ...teamQuery
    },
    unassignUserMutation,
    assignUserMutation,
}) => {
    const [messageTeamId, setMessageTeamId] = useState(null);
    const [unassignLoading, setUnassignLoading] = useState(null);
    const [selectUnassignedUserVisible, setSelectUnassignedUserVisible] = useState(false);
    const isAdmin = includes('SUPER_ADMIN')(userRoles) || includes('ADMIN')(userRoles);
    if (teamQuery.loading) return <CircularProgress />;
    return (
        <React.Fragment>
            {messageTeamId ? (
                <CreateMessageModal
                    teamId={messageTeamId}
                    teamQuery={teamQuery}
                    onClose={() => {
                        setMessageTeamId(null);
                    }}
                />
            ): null}
            {selectUnassignedUserVisible ? (
                <SelectUnassignedUserModal
                    onClose={() => {
                        setSelectUnassignedUserVisible(false);
                    }}
                    assignUserMutation={assignUserMutation}
                    teamId={prop('id')(team)}
                />
            ) : null}
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="name1">Jméno</InputLabel>
                    <Input
                        id="name1"
                        name="name1"
                        value={` ${path(['users', 0, 'firstname'])(team) || ''} ${path(['users', 0, 'lastname'])(team) || ''}`}
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="phone1">Telefon</InputLabel>
                    <Input
                        id="phone1"
                        name="phone1"
                        value={path(['users', 0, 'phone'])(team) || ''}
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="email1">Email</InputLabel>
                    <Input
                        id="email1"
                        name="email1"
                        value={path(['users', 0, 'email'])(team) || ''}
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="region1">Region</InputLabel>
                    <Input
                        id="region1"
                        name="region1"
                        value={path(['users', 0, 'region'])(team) || ''}
                    />
                </FormControl>
                {isAdmin ? (path(['users', 0, 'email'])(team) ? (
                    <Button
                        variant="outlined"
                        disabled={unassignLoading === 1}
                        onClick={() => {
                            setUnassignLoading(1);
                            unassignUserMutation({
                                variables: {
                                    id: prop('id')(team),
                                    userId: path(['users', 0, 'id'])(team),
                                }
                            }).then(() => {
                                setUnassignLoading(null);
                            })
                        }}
                    >
                        {unassignLoading === 1 ? <CircularProgress /> : null} Odebrat uživatele z týmu
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSelectUnassignedUserVisible(true);
                        }}
                    >
                        Vybrat uživatele
                    </Button>
                )) : null}
                <FormControl style={{ marginTop: '50px' }} margin="normal" fullWidth>
                    <InputLabel htmlFor="name2">Jméno</InputLabel>
                    <Input
                        id="name2"
                        name="name2"
                        value={` ${path(['users', 1, 'firstname'])(team) || ''} ${path(['users', 1, 'lastname'])(team) || ''}`}
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="phone2">Telefon</InputLabel>
                    <Input
                        id="phone2"
                        name="phone2"
                        value={path(['users', 1, 'phone'])(team) || ''}
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="email2">Email</InputLabel>
                    <Input
                        id="email2"
                        name="email2"
                        value={path(['users', 1, 'email'])(team) || ''}
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="region2">Region</InputLabel>
                    <Input
                        id="region2"
                        name="region2"
                        value={path(['users', 1, 'region'])(team) || ''}
                    />
                </FormControl>
                {isAdmin ? (path(['users', 1, 'email'])(team) ? (
                    <Button
                        variant="outlined"
                        disabled={unassignLoading === 2}
                        onClick={() => {
                            setUnassignLoading(2);
                            unassignUserMutation({
                                variables: {
                                    id: prop('id')(team),
                                    userId: path(['users', 1, 'id'])(team),
                                }
                            }).then(() => {
                                setUnassignLoading(null);
                            })
                        }}
                    >
                        {unassignLoading === 2 ? <CircularProgress /> : null} Odebrat uživatele z týmu
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSelectUnassignedUserVisible(true);
                        }}
                    >
                        Vybrat uživatele
                    </Button>
                )) : null}
        </React.Fragment>
    );
};

export default compose(
    graphql(
        gql`mutation UnassignUserMutation($id: ID!, $userId: ID!) {
            updateTeam(data: {
                id: $id
                users: {
                    disconnect: {
                        id: $userId
                    }
                }
            }) {
                id
                users {
                    id
                    email
                    firstname
                    lastname
                    phone
                    region
                }
            }
        }
        `, {
            name: 'unassignUserMutation',
        }
    ),
    graphql(
        gql`query Team($id: ID!) {
            team(id: $id) {
                id
                createdAt
                adminNote
                users {
                    id
                    email
                    firstname
                    lastname
                    phone
                    region
                }
                messages {
                    id
                    createdAt
                    text
                    author {
                        id
                        firstname
                        lastname
                    }
                }
            }
        }
        `,
        {
            options: (props) => ({
                variables: {
                    id: props.team.id,
                }
            }),
            name: 'teamQuery',
        }
    ),
    withStyles(styles)
)(TeamModal);
