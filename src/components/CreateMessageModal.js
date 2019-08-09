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
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateMessageModal = ({ onClose, classes, teamId, createMessageMutation, teamQuery }) => {
    const [text, setText] = useState('');
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
            <DialogTitle>Poslat týmu zprávu</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        setLoading(true);
                        e.preventDefault();
                        createMessageMutation({
                            variables: {
                                text,
                                teamId,
                            }
                        }).then(() => {
                            return teamQuery.refetch();
                        }).then(() => {
                            setLoading(false);
                            onClose();
                        }).catch((e) => {
                            setLoading(false);
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="text">Zpráva</InputLabel>
                        <Input
                            id="text"
                            name="text"
                            autoFocus
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
                        disabled={loading}
                    >
                        {loading ? <CircularProgress /> : 'Odeslat'}
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

export default createMessageMutation(withStyles(styles)(CreateMessageModal));
