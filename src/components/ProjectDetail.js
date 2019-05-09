import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ProjectDetail = ({ onClose, classes }) => (
    <Dialog
        open
        onClose={onClose}
        fullWidth
        maxWidth="md"
        classes={{
            paperWidthMd: classes.paper,
        }}
    >
        <DialogTitle>Projekt - detail</DialogTitle>
        <DialogContent>
            Obsah TODO
        </DialogContent>
    </Dialog>
);

export default withStyles(styles)(ProjectDetail);
