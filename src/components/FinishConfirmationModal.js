import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const FinishConfirmationModal = ({ onClose, classroom, finishMutation }) => (
    <Dialog
        open
        onClose={() => onClose(false)}
        fullWidth
        maxWidth="xs"
    >
        <DialogTitle>Skutečně chcete projekt ukončit?</DialogTitle>
        <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => onClose(false)}>NE</Button>
                <Button
                    onClick={() => {
                        finishMutation({
                            variables: {
                                id: classroom.id,
                            },
                        }).then((res) => {
                            if (!res.error) {
                                onClose(true);
                            }
                        }).catch(() => {
                            onClose(false);
                        })
                    }}
                >
                    ANO
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

const finishMutation = graphql(gql`
    mutation Finish($id: ID!) {
        finishClassroom(id: $id) {
            id
            phases {
                id
                finished
                finishDate
                checklist {
                    id
                    checked
                }
            }
        }
    }
`, {
    name: 'finishMutation'
});

export default finishMutation(FinishConfirmationModal);
