import React from 'react';
import compose from 'ramda/src/compose';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack';



const DeleteConfirmationModal = ({ onClose, eventId, deleteMutation }) => {
    
    const { enqueueSnackbar } = useSnackbar();

    const submitForm = () => {
                     deleteMutation({
                         variables: {
                         id: eventId,
                     }}).catch(err => {
                             enqueueSnackbar(
                                      'Akce nebyla smazána',
                                      {  variant: 'error',
                                         autoHideDuration: 4000,
                                         anchorOrigin: {
                                         horizontal: 'center',
                                         vertical: 'top',
                                       },
                                      },
                            );
                        });
                     const form = document.getElementById("editEventForm");
                     enqueueSnackbar(
                          'Akce byla smazána',
                          {  variant: 'success',
                             autoHideDuration: 4000,
                             anchorOrigin: {
                             horizontal: 'center',
                             vertical: 'top',
                             },
                     });
                     setTimeout(() => form.submit(), 800);
    }
    
    return (
    <Dialog
        open
        onClose={() => onClose(false)}
        fullWidth
        maxWidth="xs"
    >
        <DialogTitle>Skutečně chcete akci smazat?</DialogTitle>
        <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => onClose(false)}>NE</Button>
                <Button
                    id="deleteEventButton"
                    onClick={() => {
                        submitForm();   
                    }}
                >
                    ANO
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)};

const deleteMutation = graphql(gql`
    mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id)
    }
`, {
    name: 'deleteMutation'
});

export default compose(
    deleteMutation,
)(DeleteConfirmationModal);
