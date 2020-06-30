import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import withStyles from '@material-ui/core/styles/withStyles';
import { CircularProgress } from '@material-ui/core';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const SelectUnassignedUserModal = ({
    onClose,
    classes,
    unassignedVolunteersQuery,
    unassignedCoreUsersQuery,
    assignUserMutation,
    teamId,
}) => {
    const [loading, setLoading] = useState(false);
    const unassignedUsers = [];
    const coreUsers = unassignedCoreUsersQuery.unassignedCoreUsers;
    const volunteers = unassignedVolunteersQuery.unassignedVolunteers;

    if (coreUsers && volunteers) {
        coreUsers.forEach(el => {
            unassignedUsers.push(el);
        });
        volunteers.forEach(el => {
            unassignedUsers.push(el);
        });
    }

    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="md"
            classes={{
                paperWidthMd: classes.paper,
            }}
        >
            <DialogTitle>Vybrat uživatele {loading ? <CircularProgress /> : null}</DialogTitle>
            <DialogContent>
                {unassignedVolunteersQuery.loading ? <CircularProgress /> : (
                    <List>
                        {map((user) => (
                            <ListItem
                                key={prop('id')(user)}
                                onClick={() => {
                                    if (!loading) {
                                        setLoading(true);
                                        assignUserMutation({
                                            variables: {
                                                id: teamId,
                                                userId: prop('id')(user),
                                            }
                                        }).then(() => {
                                            setLoading(false);
                                            onClose();
                                        })
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                <ListItemText>
                                    {`${prop('firstname')(user)} ${prop('lastname')(user)} (${prop('email')(user)})`}
                                </ListItemText>
                            </ListItem>
                        ))(unassignedUsers) || []}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default compose(
    graphql(
        gql`query UnassignedVolunteers {
            unassignedVolunteers {
                id
                email
                firstname
                lastname
            }
        }
        `,
        {
            name: 'unassignedVolunteersQuery',
            options: {
                fetchPolicy: 'network-only',
            }
        }
    ),
    graphql(
        gql`query UnassignedCoreUsers {
            unassignedCoreUsers {
                id
                email
                firstname
                lastname
            }
        }
        `,
        {
            name: 'unassignedCoreUsersQuery',
            options: {
                fetchPolicy: 'network-only',
            }
        }
    ),
    graphql(
        gql`mutation AssignUserMutation($id: ID!, $userId: ID!) {
            updateTeam(data: {
                id: $id
                users: {
                    connect: {
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
            name: 'assignUserMutation',
        }
    ),
    withStyles(styles),
)(SelectUnassignedUserModal);
