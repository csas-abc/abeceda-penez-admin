import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import schoolAttributes from '../constants/schoolAttributes';
import Tabs from '@material-ui/core/Tabs';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';
import compose from 'ramda/src/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import EditSchoolForm from './forms/EditSchoolForm';
import EditContactForm from './forms/EditContactForm';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const EditSchoolModal = ({ schoolQuery, onClose, classes }) => {
    const [activeTab, setActiveTab] = useState('SCHOOL');
    const school = schoolQuery.school;
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
            <DialogTitle>Detail školy</DialogTitle>
            <DialogContent>
                {schoolQuery.loading ? (
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
                                label="Škola"
                                value="SCHOOL"
                            />
                            <Tab
                                label="Ředitel"
                                value="DIRECTOR"
                            />
                            <Tab
                                label="Zástupce"
                                value="ALTERNATE"
                            />
                        </Tabs>
                        <TabPanel value={activeTab} id="SCHOOL">
                            <EditSchoolForm
                                school={school}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id="DIRECTOR">
                            <EditContactForm
                                contact={school.director || {}}
                            />
                        </TabPanel>
                        <TabPanel value={activeTab} id="ALTERNATE">
                            <EditContactForm
                                contact={school.alternate || {}}
                            />
                        </TabPanel>
                    </React.Fragment>
                )}
            </DialogContent>
        </Dialog>
    );
};

EditSchoolModal.propTypes = {

};

const schoolQuery = graphql(gql`
    query School($id: ID!) {
        school(id: $id) {
            ${schoolAttributes}
        }
    }
`, {
    name: 'schoolQuery',
    options: ({ id }) => ({
        fetchPolicy: 'network-only',
        variables: {
            id,
        }
    })
});

export default compose(
    withStyles(styles),
    schoolQuery
)(EditSchoolModal);
