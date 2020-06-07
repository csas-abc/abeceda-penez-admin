import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import { graphql } from 'react-apollo';
import { useSnackbar } from 'notistack';

const EditContactForm = ({ contact, updateContactMutation }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(contact.name || '');
    const [email, setEmail] = useState(contact.email || '');
    const [phone, setPhone] = useState(contact.phone || '');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                updateContactMutation({
                    variables: {
                        id: contact.id,
                        name,
                        email,
                        phone,
                    }
                }).then(() => {
                    enqueueSnackbar(
                        'Kontakt byl úspěšně uložen',
                        {
                            variant: 'success',
                            autoHideDuration: 4000,
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'top',
                            },
                        }
                    )
                }).catch((e) => {
                    console.error('ERROR', e);
                })
            }}
        >
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="name">Jméno a příjmené</InputLabel>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="phone">Telefon</InputLabel>
                <Input
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="email">E-mail</InputLabel>
                <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
            >
                Uložit
            </Button>
        </form>
    );
};

const updateContactMutation = gql`
    mutation UpdateContact(
        $id: ID!
        $name: String
        $email: String
        $phone: String
    ) {
        updateContact(
            data: {
                id: $id
                name: $name
                email: $email
                phone: $phone
            }
        ) {
            id
            name
            phone
            email
        }
    }
`;

EditContactForm.propTypes = {

};

export default compose(
    graphql(
        updateContactMutation,
        {
            name: 'updateContactMutation',
        },
    ),
)(EditContactForm);
