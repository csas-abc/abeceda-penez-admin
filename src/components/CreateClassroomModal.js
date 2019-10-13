import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateClassroomModal = ({ onClose, classes, createClassroomMutation }) => {
    const [semester, setSemester] = useState(1);
    const [loading, setLoading] = useState(false);
    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            classes={{
                paperWidthMd: classes.paper,
            }}
        >
            <DialogTitle>Vytvořit třídu</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        setLoading(true);
                        e.preventDefault();
                        createClassroomMutation({
                            variables: {
                                semester
                            }
                        }).then(() => {
                            setLoading(false);
                            onClose();
                        }).catch((e) => {
                            setLoading(false);
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="semester">Pololetí</InputLabel>
                        <Select
                            inputProps={{
                                id: 'semester',
                                name: 'semester'
                            }}
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <MenuItem value={1}>1. pololetí</MenuItem>
                            <MenuItem value={2}>2. pololetí</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress /> : 'Vytvořit'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const createClassroomMutation = graphql(gql`
    mutation CreateClassroom($semester: Int!) {
        createClassroom(semester: $semester) {
            id
        }
    }
`, {
    name: 'createClassroomMutation',
});

export default createClassroomMutation(withStyles(styles)(CreateClassroomModal));
