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
    const [branchRepresentativeName, setBranchRepresentativeName] = useState(classroom.branchRepresentativeName);
    const [branchRepresentativeEmail, setBranchRepresentativeEmail] = useState(classroom.branchRepresentativeEmail);
    const [branchRepresentativePhone, setBranchRepresentativePhone] = useState(classroom.branchRepresentativePhone);
    const [branchAddress, setBranchAddress] = useState(classroom.branchAddress);

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
            <DialogTitle>Detail pobočky</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateClassroomMutation({
                            variables: {
                                id: classroom.id,
                                branchRepresentativeName,
                                branchRepresentativeEmail,
                                branchRepresentativePhone,
                                branchAddress,
                            }
                        }).then(() => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="branchRepresentativeName">Jméno zástupce</InputLabel>
                        <Input
                            id="branchRepresentativeName"
                            name="branchRepresentativeName"
                            autoFocus
                            value={branchRepresentativeName}
                            onChange={(e) => setBranchRepresentativeName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="branchRepresentativeEmail">E-mail zástupce</InputLabel>
                        <Input
                            id="branchRepresentativeEmail"
                            name="branchRepresentativeEmail"
                            value={branchRepresentativeEmail}
                            onChange={(e) => setBranchRepresentativeEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="branchRepresentativePhone">Telefon</InputLabel>
                        <Input
                            id="branchRepresentativePhone"
                            name="branchRepresentativePhone"
                            value={branchRepresentativePhone}
                            onChange={(e) => setBranchRepresentativePhone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="branchAddress">Adresa pobočky</InputLabel>
                        <Input
                            id="branchAddress"
                            name="branchAddress"
                            value={branchAddress}
                            onChange={(e) => setBranchAddress(e.target.value)}
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
