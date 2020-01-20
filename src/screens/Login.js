import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import compose from 'ramda/src/compose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import logo from '../assets/cs-logo.svg';
import MLink from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
        textAlign: 'center'
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    logo: {
        width: '100%',
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const Login = ({ classes, loginMutation, history: { push } }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    return (
        <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
                <img src={logo} alt="Abeceda penez logo" className={classes.logo} />
                {error ? (
                    <SnackbarContent
                        className={classes.errorMessage}
                        message="Přihlášení se nezdařilo"
                    />
                ) : null}
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        loginMutation({
                            variables: {
                                email,
                                password,
                            }
                        }).then((res) => {
                            localStorage.setItem('token', res.data.login.token);
                            push('/');
                        }).catch((e) => {
                            setError(e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">E-mail</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Heslo</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Přihlásit
                    </Button>
                    <div
                        style={{
                            paddingTop: '15px',
                            fontFamily: '"Roboto"',

                        }}
                    >
                        <Typography variant="body1">
                            <MLink component={Link} to="/forgot-password">
                                Zapomenuté heslo
                            </MLink>
                        </Typography>
                    </div>
                </form>
            </Paper>
        </main>
    );
};

const loginMutation = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(data: { email: $email, password: $password }) {
            token,
            user { id, email }
        }
    }
`;

export default compose(
    withRouter,
    withStyles(styles),
    graphql(loginMutation, {
        name: 'loginMutation'
    })
)(Login);
