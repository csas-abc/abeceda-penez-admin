import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import CreateMessageModal from '../CreateMessageModal';
import { CircularProgress } from '@material-ui/core';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const TeamModal = ({
    updateTeamMutation,
    teamQuery: {
        team,
        ...teamQuery,
    },
}) => {
    const [messageTeamId, setMessageTeamId] = useState(null);
    const [adminNote, setAdminNote] = useState(prop('adminNote')(team) || '');
    useEffect(() => {
        setAdminNote(prop('adminNote')(team) || '');
    }, [teamQuery.loading]);
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
                <FormControl margin="normal" required fullWidth>
                    <Input
                        id="adminNote"
                        name="adminNote"
                        autoFocus
                        autoComplete="off"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                    onClick={() => {
                        updateTeamMutation({
                            variables: {
                                id: team.id,
                                adminNote,
                            }
                        });
                    }}
                >
                    Uložit
                </Button>
        </React.Fragment>
    );
};

export default compose(
    graphql(
        gql`mutation UpdateTeamMutation($id: ID!, $adminNote: String!) {
            updateTeam(data: {
                id: $id
                adminNote: $adminNote
            }) {
                id
                adminNote
            }
        }

        `,
        {
            name: 'updateTeamMutation',
        },
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
