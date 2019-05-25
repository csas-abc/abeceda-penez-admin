import React, { useState } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import tail from 'ramda/src/tail';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Message from '@material-ui/icons/Message';
import withStyles from '@material-ui/core/styles/withStyles';
import ProjectDetail from './ProjectDetail';
import CreateUser from './CreateUser';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CreateMessageModal from './CreateMessageModal';

const styles = (theme) => ({
    table: {
        minWidth: 1800,
    },
    popover: {
        margin: theme.spacing.unit * 2,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const OverviewTable = ({ classes, teamsQuery, client }) => {
    const [popoverEl, setPopoverEl] = useState(null);
    const [projectDetail, setProjectDetail] = useState(null);
    const [messageTeamId, setMessageTeamId] = useState(null);
    const [createUserTeam, setCreateUserTeam] = useState(null);
    if (teamsQuery.loading) return <CircularProgress />;
    if (teamsQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <React.Fragment>
            {projectDetail ? <ProjectDetail onClose={() => setProjectDetail(null)} /> : null}
            {createUserTeam ? (
                <CreateUser
                    teamId={createUserTeam}
                    onClose={() => {
                        teamsQuery.refetch();
                        setCreateUserTeam(null);
                    }}
                />
            ): null}
            {messageTeamId ? (
                <CreateMessageModal
                    teamId={messageTeamId}
                    onClose={() => {
                        setMessageTeamId(null);
                    }}
                />
            ): null}
            <Popover
                id="simple-popper"
                open={!!popoverEl}
                anchorEl={popoverEl}
                onClose={() => setPopoverEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.popover}>Toto vidim velky <span style={{ fontWeight: 'bold', color: 'red' }}>spatny</span></Typography>
            </Popover>
            <Button
                color="primary"
                onClick={() => {
                    client.query({
                        query: gql`query CreateTeamQuery {
                            createTeam {
                                id
                            }
                        }`,
                        fetchPolicy: 'network-only',
                    }).then((res) => {
                        teamsQuery.refetch();
                    })
                }}
            >
                Vytvořit tým
            </Button>
            <Divider />
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Zpráva</TableCell>
                        <TableCell>Tým</TableCell>
                        <TableCell>Projekt</TableCell>
                        <TableCell>Faze 1</TableCell>
                        <TableCell>Faze 2</TableCell>
                        <TableCell>Faze 3</TableCell>
                        <TableCell>Faze 4</TableCell>
                        <TableCell>Faze 5</TableCell>
                        <TableCell>Faze 6</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teamsQuery.teams.map((team) => (
                        <React.Fragment key={team.id}>
                            <TableRow>
                                <TableCell rowSpan={team.classrooms.length || 1}>{team.id}</TableCell>
                                <TableCell>
                                    <Message onClick={() => setMessageTeamId(team.id)} />
                                </TableCell>
                                <TableCell rowSpan={team.classrooms.length || 1}>
                                    <React.Fragment>
                                        {team.users.map((user) => (
                                            <React.Fragment key={user.id}>
                                                {user.activated ? `${user.firstname} ${user.lastname}` : `${user.email} (${user.securityCode})`}<br />
                                            </React.Fragment>
                                        ))}
                                        <Button
                                            size="small"
                                            onClick={() => setCreateUserTeam(team.id)}
                                            variant="outlined"
                                        >
                                            Přidat
                                        </Button>
                                    </React.Fragment>
                                </TableCell>
                                {team.classrooms && team.classrooms[0] ? (
                                    <TableCell>
                                        {team.classrooms[0].classroomName}
                                    </TableCell>) : null
                                }
                                {team.classrooms && team.classrooms[0] ? map((phase) => (
                                    <TableCell key={phase.id}>{phase.name}</TableCell>
                                ))(team.classrooms[0].phases) : null}
                            </TableRow>
                            {compose(
                                map((classroom) => (
                                    <React.Fragment key={classroom.id}>
                                        <TableRow>
                                            <TableCell>{classroom.classroomName}</TableCell>
                                            {map((phase) => (
                                                <TableCell key={phase.id}>{phase.name}</TableCell>
                                            ))(classroom.phases)}
                                        </TableRow>
                                    </React.Fragment>
                                )),
                                tail,
                            )(team.classrooms)}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

const teamsQuery = graphql(gql`
    {
        teams {
            id,
            classrooms {
                id,
                classroomName,
                phases {
                    id,
                    number,
                    name,
                    targets
                },
            }
            users {
                id
                email,
                firstname,
                lastname,
                activated,
                securityCode
            }
        }
    }
`, {
    name: 'teamsQuery',
    options: {
        fetchPolicy: 'network-only',
    }
});

export default compose(
    withStyles(styles),
    teamsQuery,
    withApollo,
)(OverviewTable);
