import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import propOr from 'ramda/src/propOr';
import prop from 'ramda/src/prop';
import pathOr from 'ramda/src/pathOr';
import pluck from 'ramda/src/pluck';
import compose from 'ramda/src/compose';
import contains from 'ramda/src/contains';
import TabPanel from './TabPanel';
import ProjectForm from './forms/ProjectForm';
import BranchForm from './forms/BranchForm';
import SchoolForm from './forms/SchoolForm';
import TeamUsersForm from './forms/TeamUsersForm';
import MessagesForm from './forms/MessagesForm';
import AdminNoteForm from './forms/AdminNoteForm';
import ToolboxForm from './forms/ToolboxForm';
import ProjectState from './ProjectState';
import FairForm from './forms/FairForm';
import ProjectFiles from './ProjectFiles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import classroomAttributes from '../constants/classroomAttributes';
import { CircularProgress } from '@material-ui/core';
import ProjectModalTabs from '../constants/ProjectModalTabs';
import { any } from '../utils/permissions';
import EditContactForm from './forms/EditContactForm';
import Typography from '@material-ui/core/Typography';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ProjectModal = ({
    onClose,
    classes,
    classroomQuery: { classroom = {}, ...classroomQuery },
    defaultTab,
    meQuery,
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const userRegion = pathOr('', ['me', 'region'])(meQuery);
    const userRoles = compose(
        pluck('name'),
        pathOr([], ['me', 'roles']),
    )(meQuery);
    const classroomRegion = pathOr('', ['team', 'users', 0, 'region'])(classroom);
    const classroomType = propOr('', 'type')(classroom);
    const editDisabled = () => {
        if (contains('ADMIN')(userRoles)) {
            return false;
        }
        if (contains('CORE')(userRoles)) {
            if (classroomType !== 'CORE') return true;
            return userRegion !== classroomRegion;
        }
    };

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
                {classroomQuery.loading ? (
                    <CircularProgress />
                ) : (
                    <React.Fragment>
                        <Tabs
                            value={activeTab}
                            onChange={(e, value) => setActiveTab(value)}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab
                                label="Detail projektu"
                                value={ProjectModalTabs.PROJECT_DETAIL}
                            />
                            {any(['ADMIN', 'SUPER_ADMIN'])(meQuery) ? (
                                <Tab
                                    label="Stav projektu"
                                    value={ProjectModalTabs.PROJECT_STATE}
                                />
                            ) : null}
                            <Tab
                                label="Pobočka"
                                value={ProjectModalTabs.BRANCH}
                            />
                            <Tab
                                label="Škola"
                                value={ProjectModalTabs.SCHOOL}
                            />
                            <Tab
                                label="Jarmark"
                                value={ProjectModalTabs.FAIR}
                            />
                            {any(['ADMIN', 'SUPER_ADMIN'])(meQuery) ? (
                                <Tab
                                    label="Uživatelé"
                                    value={ProjectModalTabs.USERS}
                                />
                            ) : null}
                            {any(['ADMIN', 'SUPER_ADMIN'])(meQuery) && classroom.type !== 'CORE' ? (
                                <Tab
                                    label="Zprávy"
                                    value={ProjectModalTabs.MESSAGES}
                                />
                            ) : null}
                            <Tab
                                label="Toolbox"
                                value={ProjectModalTabs.TOOLBOX}
                            />
                            <Tab
                                label="Poznámka"
                                value={ProjectModalTabs.NOTE}
                            />
                            <Tab
                                label="Fotografie"
                                value={ProjectModalTabs.PHOTOS}
                            />
                        </Tabs>
                        <TabPanel value={activeTab} id={ProjectModalTabs.PROJECT_DETAIL}>
                            <ProjectForm
                                classroom={classroom}
                                onClose={onClose}
                                userRoles={userRoles}
                                editDisabled={editDisabled()}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.PROJECT_STATE}>
                            <ProjectState
                                classroom={classroom}
                                userRoles={userRoles}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.BRANCH}>
                            <BranchForm
                                classroom={classroom}
                                onClose={onClose}
                                editDisabled={editDisabled()}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.SCHOOL}>
                            <SchoolForm
                                classroom={classroom}
                                editDisabled={editDisabled()}
                            />
                            <Typography variant="h5" style={{ marginTop: '24px', marginBottom: 0 }}>
                                Učitel
                            </Typography>
                            <EditContactForm
                                contact={propOr({}, 'teacher')(classroom)}
                                classroomId={prop('id')(classroom)}
                                onClose={onClose}
                                editDisabled={editDisabled()}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.FAIR}>
                            <FairForm
                                classroom={classroom}
                                onClose={onClose}
                                editDisabled={editDisabled()}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.USERS}>
                            <TeamUsersForm
                                userRoles={userRoles}
                                team={propOr({}, 'team')(classroom)} />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.MESSAGES}>
                            <MessagesForm userRoles={userRoles} team={propOr({}, 'team')(classroom)} />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.TOOLBOX}>
                            <ToolboxForm
                                toolbox={prop('toolboxOrder')(classroom)}
                                classroomId={prop('id')(classroom)}
                                classroomQuery={classroomQuery}
                                editDisabled={editDisabled()}
                                classroom={classroom}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.NOTE}>
                            <AdminNoteForm
                                team={propOr({}, 'team')(classroom)}
                                editDisabled={editDisabled()}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id={ProjectModalTabs.PHOTOS}>
                            <ProjectFiles
                                classroom={classroom}
                                editDisabled={editDisabled()}
                            />
                        </TabPanel>
                    </React.Fragment>
                )}
            </DialogContent>
        </Dialog>
    );
};

const meQuery = graphql(gql`
    {
        me {
            id
            email
            region
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

const classroomQuery = graphql(gql`
    query Classroom($id: ID!) {
        classroom(id: $id) {
            ${classroomAttributes}
        }
    }
`, {
    name: 'classroomQuery',
    options: (props) => ({
        variables: {
            id: props.classroom.id,
        },
    }),
});

export default compose(
    withStyles(styles),
    meQuery,
    classroomQuery
)(ProjectModal);
