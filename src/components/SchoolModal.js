import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import updateClassroomMutation from '../utils/updateClassroomMutation';
import { graphql } from 'react-apollo';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const BranchModal = ({
    onClose,
    classes,
    updateClassroomMutation,
    classroom,
}) => {
    const [schoolAddress, setSchoolAddress] = useState(classroom.schoolAddress);
    const [directorName, setDirectorName] = useState(classroom.directorName);
    const [directorPhone, setDirectorPhone] = useState(classroom.directorPhone);
    const [directorEmail, setDirectorEmail] = useState(classroom.directorEmail);

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
            <DialogTitle>Detail školy</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateClassroomMutation({
                            variables: {
                                id: classroom.id,
                                schoolAddress,
                                directorName,
                                directorPhone,
                                directorEmail,
                            }
                        }).then(() => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="directorName">Jméno zástupce</InputLabel>
                        <Input
                            id="directorName"
                            name="directorName"
                            autoFocus
                            value={directorName}
                            onChange={(e) => setDirectorName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="directorEmail">E-mail zástupce</InputLabel>
                        <Input
                            id="directorEmail"
                            name="directorEmail"
                            value={directorEmail}
                            onChange={(e) => setDirectorEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="directorPhone">Telefon</InputLabel>
                        <Input
                            id="directorPhone"
                            name="directorPhone"
                            value={directorPhone}
                            onChange={(e) => setDirectorPhone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="schoolAddress">Adresa školy</InputLabel>
                        <Input
                            id="schoolAddress"
                            name="schoolAddress"
                            value={schoolAddress}
                            onChange={(e) => setSchoolAddress(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Uložit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default compose(
    graphql(
        updateClassroomMutation,
        {
            name: 'updateClassroomMutation',
        },
    ),
    withStyles(styles)
)(BranchModal);
