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
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ToolboxModal = ({
    onClose,
    classes,
    updateToolboxOrder,
    toolbox,
}) => {
    const [childrenCount, setChildrenCount] = useState(toolbox.childrenCount);
    const [recipient, setRecipient] = useState(toolbox.recipient);
    const [address, setAddress] = useState(toolbox.address);

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
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateToolboxOrder({
                            variables: {
                                id: toolbox.id,
                                childrenCount,
                                recipient,
                                address,
                            }
                        }).then(() => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="branchRepresentativeName">Adresát</InputLabel>
                        <Input
                            id="recipient"
                            name="recipient"
                            autoFocus
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="address">Adresa</InputLabel>
                        <Input
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="childrenCount">Počet dětí</InputLabel>
                        <Input
                            id="childrenCount"
                            name="childrenCount"
                            value={childrenCount}
                            onChange={(e) => setChildrenCount(e.target.value)}
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
    graphql(gql`
        mutation UpdateToolboxOrder($id: ID!, $recipient: String!, $address: String!, $childrenCount: String!) {
            updateToolboxOrder(data: {
                id: $id,
                recipient: $recipient
                address: $address
                childrenCount: $childrenCount
            }) {
                id
                recipient
                address
                childrenCount
            }
        }
    `,
        {
            name: 'updateToolboxOrder',
        },
    ),
    withStyles(styles)
)(ToolboxModal);
