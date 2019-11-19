import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';
import TeamUsersForm from './forms/TeamUsersForm';
import MessagesForm from './forms/MessagesForm';
import AdminNoteForm from './forms/AdminNoteForm';
import compose from 'ramda/src/compose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import pluck from 'ramda/src/pluck';
import pathOr from 'ramda/src/pathOr';


const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const TeamModal = ({
    onClose,
    classes,
    team,
    meQuery
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const userRoles = compose(
        pluck('name'),
        pathOr([], ['me', 'roles']),
    )(meQuery);
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
                <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
                    <Tab label="Uživatelé"></Tab>
                    <Tab label="Zprávy"></Tab>
                    <Tab label="Poznámka"></Tab>
                </Tabs>
                <TabPanel value={activeTab} id={0}>
                    <TeamUsersForm userRoles={userRoles} team={team} />
                </TabPanel>
                <TabPanel value={activeTab} iid={1}>
                    <MessagesForm userRoles={userRoles} team={team} />
                </TabPanel>
                <TabPanel value={activeTab} id={2}>
                    <AdminNoteForm team={team} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
};

const meQuery = graphql(gql`
    {
        me {
            id
            email
            roles {
                name
            }
        }
    }
`, {
    name: 'meQuery',
    options: {
        fetchPolicy: 'cache-only',
    },
});

export default compose(
    meQuery,
    (withStyles(styles)),
)(TeamModal);
