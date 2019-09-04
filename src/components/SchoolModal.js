import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import SchoolForm from './forms/SchoolForm';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const BranchModal = ({
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
        <DialogTitle>Detail školy</DialogTitle>
        <DialogContent>
            <SchoolForm
                classroom={classroom}
                onClose={onClose}
            />
        </DialogContent>
    </Dialog>
);

export default withStyles(styles)(BranchModal);
