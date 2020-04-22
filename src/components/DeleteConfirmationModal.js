import React from 'react';
import compose from 'ramda/src/compose';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const DeleteConfirmationModal = ({ onClose, classroom, deleteMutation, recoverMutation }) => (
    <Dialog
        open
        onClose={() => onClose(false)}
        fullWidth
        maxWidth="xs"
    >
        <DialogTitle>Skutečně chcete projekt {classroom.deleted ? 'obnovit' : 'smazat'}?</DialogTitle>
        <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => onClose(false)}>NE</Button>
                <Button
                    onClick={() => {
                        if (classroom.deleted) {
                            recoverMutation({
                                variables: {
                                    id: classroom.id,
                                },
                            }).then(() => {
                                onClose(true);
                            });
                        } else {
                            deleteMutation({
                                variables: {
                                    id: classroom.id,
                                },
                            }).then(() => {
                                onClose(true);
                            });
                        }
                    }}
                >
                    ANO
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

const deleteMutation = graphql(gql`
    mutation Delete($id: ID!) {
        delete(id: $id) {
            id
            deleted
        }
    }
`, {
    name: 'deleteMutation'
});

const recoverMutation = graphql(gql`
    mutation Recovery($id: ID!) {
        recover(id: $id) {
            id
            archived
        }
    }
`, {
    name: 'recoverMutation'
});

export default compose(
    deleteMutation,
    recoverMutation,
)(DeleteConfirmationModal);
