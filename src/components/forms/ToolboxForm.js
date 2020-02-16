import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import propOr from 'ramda/src/propOr';
import propEq from 'ramda/src/propEq';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { useSnackbar } from 'notistack';
import { all } from '../../utils/permissions';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ToolboxForm = ({
    classes,
    updateToolboxOrder,
    toolbox,
    createToolboxOrder,
    classroomId,
    classroomQuery,
    editDisabled,
    classroom,
    meQuery,
}) => {
    const isCoreProject = propEq('type', 'CORE')(classroom);
    const isCoreUser = all(['CORE'])(meQuery);
    const prefillData = isCoreProject && isCoreUser;
    const [childrenCount, setChildrenCount] = useState(propOr('', 'childrenCount')(toolbox));
    const [address, setAddress] = useState(propOr(
        (prefillData ? propOr('', 'branchAddress')(classroom) : ''),
        'address',
    )(toolbox));
    const [recipient, setRecipient] = useState(propOr(
        (prefillData ? propOr('', 'branchRepresentativeEmail')(classroom) : ''),
        'recipient',
    )(toolbox));
    const [creatingOrder, setCreatingOrder] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                e.preventDefault();
                if (toolbox) {
                    updateToolboxOrder({
                        variables: {
                            id: toolbox.id,
                            childrenCount,
                            recipient,
                            address,
                        }
                    }).catch((e) => {
                        console.error('ERROR', e);
                    })
                } else {
                    setCreatingOrder(true);
                    createToolboxOrder({
                        variables: {
                            childrenCount,
                            recipient,
                            address,
                            classroomId,
                        }
                    }).then(() => {
                        enqueueSnackbar(
                            'Toolbox úspěšně objednán',
                            {
                                variant: 'success',
                                autoHideDuration: 4000,
                                anchorOrigin: {
                                    horizontal: 'center',
                                    vertical: 'top',
                                },
                            },
                        );
                        return classroomQuery.refetch();
                    }).then(() => {
                        setCreatingOrder(false);
                    });
                }
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
                disabled={creatingOrder || editDisabled}
            >
                {creatingOrder ? <CircularProgress /> : null} {toolbox ? 'Uložit' : 'Vytvořit'}
            </Button>
        </form>
    );
};

const meQuery = gql`
    {
        me {
            id
            email
            roles {
                name
            }
        }
    }
`;

export default compose(
    graphql(meQuery, {
        name: 'meQuery',
    }),
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
    graphql(gql`
        mutation CreateToolboxOrder($classroomId: ID!, $address: String!, $recipient: String!, $childrenCount: String!) {
            createToolboxOrder(data: {
                address: $address
                recipient: $recipient
                classroomId: $classroomId
                childrenCount: $childrenCount
            }) {
                id
            }
        }
    `, {
        name: 'createToolboxOrder'
    }),
    withStyles(styles)
)(ToolboxForm);
