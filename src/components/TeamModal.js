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


const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const TeamModal = ({
    onClose,
    classes,
    team,
}) => {
    const [activeTab, setActiveTab] = useState(0);
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
                <TabPanel value={activeTab} index={0}>
                    <TeamUsersForm team={team} />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <MessagesForm team={team} />
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <AdminNoteForm team={team} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
};

export default withStyles(styles)(TeamModal);
