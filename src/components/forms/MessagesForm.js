import React, { useState } from 'react';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import List  from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import map from 'ramda/src/map';
import sortWith from 'ramda/src/sortWith';
import descend from 'ramda/src/descend';
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
    teamQuery: {
        team,
        ...teamQuery,
    },
}) => {
    const [messageTeamId, setMessageTeamId] = useState(null);
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
            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={() => {
                    setMessageTeamId(team.id);
                }}
            >
                Odeslat novou zprávu
            </Button>
            <List>
                {compose(
                    map((message) => (
                        <React.Fragment key={message.id}>
                            <ListItem>
                                <ListItemText
                                    primary={message.text}
                                    secondary={`${message.author.firstname} ${message.author.lastname} (${moment(message.createdAt).format('L LT')})`}
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    )),
                    sortWith([
                        descend(prop('createdAt')),
                    ])
                )(team.messages || [])}
            </List>
        </React.Fragment>
    );
};

export default compose(
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
