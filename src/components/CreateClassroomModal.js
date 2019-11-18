import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import moment from 'moment';
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
import path from 'ramda/src/path';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateClassroomModal = ({ onClose, classes, createClassroomMutation }) => {
    let initialYear;
    const now = moment();
    if (now.month() < 8) {
        initialYear = now.year() - 1;
    } else {
        initialYear = now.year();
    }

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
                                semester: semester % 2 === 1 ? 1 : 2,
                                year: semester > 2 ? initialYear + 1 : initialYear,
                            }
                        }).then((res) => {
                            setLoading(false);
                            onClose(path(['data', 'createClassroom', 'id'])(res));
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
                            <MenuItem value={1}>1. pol {initialYear}/{initialYear + 1}</MenuItem>
                            <MenuItem value={2}>2. pol {initialYear}/{initialYear + 1}</MenuItem>
                            <MenuItem value={3}>1. pol {initialYear + 1}/{initialYear + 2}</MenuItem>
                            <MenuItem value={4}>2. pol {initialYear + 1}/{initialYear + 2}</MenuItem>
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
    mutation CreateClassroom($semester: Int!, $year: Int!) {
        createClassroom(semester: $semester, year: $year) {
            id
        }
    }
`, {
    name: 'createClassroomMutation',
});

export default createClassroomMutation(withStyles(styles)(CreateClassroomModal));
