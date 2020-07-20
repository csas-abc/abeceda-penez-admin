import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import roadmapEventAttributes from '../constants/roadmapEventAttributes';
import compose from 'ramda/src/compose';
import propOr from 'ramda/src/propOr';
import DeleteRoadmapEventConfirmationModal from './DeleteRoadmapEventConfirmationModal';
import EditRoadmapEventForm from './forms/EditRoadmapEventForm';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const EditRoadmapEventModal = ({
    onClose,
    classes,
    roadmapQuery,
    roadmapEventQuery,
}) => {
    const roadmapEvent = propOr({}, 'roadmapEvent')(roadmapEventQuery);
    const [deleteEvent, setDeleteEvent] = useState(null);
    return (
        <Dialog
            open
            onClose={() => onClose(false)}
            fullWidth
            maxWidth="sm"
            classes={{
                paperWidthMd: classes.paper,
            }}
        >
            {deleteEvent ? (
                <DeleteRoadmapEventConfirmationModal
                    roadmapQuery={roadmapQuery}
                    eventId={deleteEvent}
                    onClose={refetch => {
                        onClose(true);
                        roadmapQuery.refetch();
                        setDeleteEvent(null);
                    }}
                />
            ) : null}
            <DialogTitle>Upravit akci</DialogTitle>
            <DialogContent>
                {!roadmapEvent || roadmapEventQuery.loading ? (
                    <CircularProgress />
                ) : (
                    <EditRoadmapEventForm
                        roadmapEvent={roadmapEvent}
                        onClose={onClose}
                        setDeleteItem={() => setDeleteEvent(roadmapEvent.id)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

const roadmapEventQuery = graphql(gql`
    query RoadmapEvent($id: ID!){
        roadmapEvent(id: $id) {
            ${roadmapEventAttributes}
        }
    }
`, {
    name: 'roadmapEventQuery',
    options: (props) => ({
        fetchPolicy: 'network-only',
        variables: {
            id: props.eventId,
        },
    }),
});

export default compose(
    roadmapEventQuery,
    withStyles(styles),
)(EditRoadmapEventModal);
