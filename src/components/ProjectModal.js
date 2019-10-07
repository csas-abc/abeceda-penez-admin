import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import propOr from 'ramda/src/propOr';
import TabPanel from './TabPanel';
import ProjectForm from './forms/ProjectForm';
import BranchForm from './forms/BranchForm';
import SchoolForm from './forms/SchoolForm';
import TeamUsersForm from './forms/TeamUsersForm';
import MessagesForm from './forms/MessagesForm';
import AdminNoteForm from './forms/AdminNoteForm';
import ProjectState from './ProjectState';
import FairForm from './forms/FairForm';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ProjectModal = ({
    onClose,
    classes,
    classroom,
    defaultTab = 0,
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    return (
        <Dialog
            open
            onClose={() => onClose(false)}
            fullWidth
            maxWidth="xl"
            classes={{
                paperWidthXl: classes.paper,
            }}
        >
            <DialogTitle>Detail projektu</DialogTitle>
            <DialogContent>
                <Tabs
                    value={activeTab}
                    onChange={(e, value) => setActiveTab(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Detail projektu"></Tab>
                    <Tab label="Stav projektu"></Tab>
                    <Tab label="Pobočka"></Tab>
                    <Tab label="Škola"></Tab>
                    <Tab label="Jarmark"></Tab>
                    <Tab label="Uživatelé"></Tab>
                    <Tab label="Zprávy"></Tab>
                    <Tab label="Poznámka"></Tab>
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                    <ProjectForm
                        classroom={classroom}
                        onClose={onClose}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <ProjectState classroom={classroom} />
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <BranchForm
                        classroom={classroom}
                        onClose={onClose}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={3}>
                    <SchoolForm
                        classroom={classroom}
                        onClose={onClose}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={4}>
                    <FairForm
                        classroom={classroom}
                        onClose={onClose}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={5}>
                    <TeamUsersForm team={propOr({}, 'team')(classroom)} />
                </TabPanel>
                <TabPanel value={activeTab} index={6}>
                    <MessagesForm team={propOr({}, 'team')(classroom)} />
                </TabPanel>
                <TabPanel value={activeTab} index={7}>
                    <AdminNoteForm team={propOr({}, 'team')(classroom)} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
};

export default withStyles(styles)(ProjectModal);
