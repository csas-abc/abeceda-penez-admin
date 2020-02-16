import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import ToolboxForm from './forms/ToolboxForm';
import prop from 'ramda/src/prop';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ToolboxModal = ({
    onClose,
    classes,
    toolbox,
}) => {
    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="md"
            classes={{
                paperWidthMd: classes.paper,
            }}
        >
            <DialogTitle>Detail toolboxu</DialogTitle>
            <DialogContent>
                <ToolboxForm
                    toolbox={toolbox}
                    onClose={onClose}
                    classroom={prop('classroom')(toolbox)}
                />
            </DialogContent>
        </Dialog>
    );
};

export default withStyles(styles)(ToolboxModal);
