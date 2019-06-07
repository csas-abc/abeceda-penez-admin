import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const UserDetail = ({ onClose, classes, teamId, createMessageMutation }) => {
    const [text, setText] = useState('');
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
            <DialogTitle>Detail uživatele</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        createMessageMutation({
                            variables: {
                                text,
                                teamId,
                            }
                        }).then(() => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="text">Jméno</InputLabel>
                        <Input
                            id="text"
                            name="text"
                            autoFocus
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="text">Příjmení</InputLabel>
                        <Input
                            id="text"
                            name="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
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

const createMessageMutation = graphql(gql`
    mutation CreateMessageMutation($text: String!, $teamId: ID!,) {
        createMessage(text: $text, teamId: $teamId) {
            id
            text
        }
    }
`, {
    name: 'createMessageMutation',
});

export default createMessageMutation(withStyles(styles)(UserDetail));
