import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import FairForm from './forms/FairForm';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const FairModal = ({
    onClose,
    classes,
    classroom,
}) => (
    <Dialog
        open
        onClose={onClose}
        fullWidth
        maxWidth="md"
        classes={{
            paperWidthMd: classes.paper,
        }}
    >
        <DialogTitle>Detail jarmarku</DialogTitle>
        <DialogContent>
            <FairForm classroom={classroom} onClose={onClose} />
        </DialogContent>
    </Dialog>
);

export default withStyles(styles)(FairModal);
