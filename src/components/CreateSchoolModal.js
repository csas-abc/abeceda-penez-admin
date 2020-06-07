import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import CreateSchoolForm from './forms/CreateSchoolForm';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateSchoolModal = ({
    onClose,
    classes,
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
        <DialogTitle>Vytvořit školu</DialogTitle>
        <DialogContent>
            <CreateSchoolForm
                onClose={onClose}
            />
        </DialogContent>
    </Dialog>
);

export default withStyles(styles)(CreateSchoolModal);
