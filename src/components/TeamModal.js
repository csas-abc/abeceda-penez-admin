import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import List  from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import path from 'ramda/src/path';
import map from 'ramda/src/map';
import sortWith from 'ramda/src/sortWith';
import descend from 'ramda/src/descend';
import prop from 'ramda/src/prop';
import { graphql } from 'react-apollo';
import CreateMessageModal from './CreateMessageModal';
import { CircularProgress } from '@material-ui/core';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ display: index !== value ? 'none' : null }}
            {...other}
        >
            {children}
        </Typography>
    );
};

const TeamModal = ({
    onClose,
    classes,
    updateTeamMutation,
    // team,
    teamQuery: {
        team,
        ...teamQuery,
    },
}) => {
    console.log('Q', teamQuery);
    const [activeTab, setActiveTab] = useState(0);
    const [messageTeamId, setMessageTeamId] = useState(null);
    const [adminNote, setAdminNote] = useState(prop('adminNote')(team) || '');
    useEffect(() => {
        setAdminNote(prop('adminNote')(team) || '');
    }, [teamQuery.loading]);
    if (teamQuery.loading) return <CircularProgress />;
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
            <DialogTitle>Detail týmu</DialogTitle>
            <DialogContent>
                {messageTeamId ? (
                    <CreateMessageModal
                        teamId={messageTeamId}
                        teamQuery={teamQuery}
                        onClose={() => {
                            setMessageTeamId(null);
                        }}
                    />
                ): null}
                <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
                    <Tab label="Uživatelé"></Tab>
                    <Tab label="Zprávy"></Tab>
                    <Tab label="Poznámka"></Tab>
                </Tabs>
                <TabPanel value={activeTab} index={0}>
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
                            value={path(['users', 0, 'phone'])(team)}
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email1">Email</InputLabel>
                        <Input
                            id="email1"
                            name="email1"
                            value={path(['users', 0, 'email'])(team)}
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="region1">Region</InputLabel>
                        <Input
                            id="region1"
                            name="region1"
                            value={path(['users', 0, 'region'])(team)}
                        />
                    </FormControl>

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
                            value={path(['users', 1, 'phone'])(team)}
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email2">Email</InputLabel>
                        <Input
                            id="email2"
                            name="email2"
                            value={path(['users', 1, 'email'])(team)}
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="region2">Region</InputLabel>
                        <Input
                            id="region2"
                            name="region2"
                            value={path(['users', 1, 'region'])(team)}
                        />
                    </FormControl>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
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
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <FormControl margin="normal" required fullWidth>
                        <Input
                            id="adminNote"
                            name="adminNote"
                            autoFocus
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
                </TabPanel>
            </DialogContent>
        </Dialog>
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
