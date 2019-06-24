import React, { useState } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import tail from 'ramda/src/tail';
import find from 'ramda/src/find';
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

const getActivePhase = (classroom) => find((phase) => !phase.finished)(classroom.phases || []);

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
                variant="outlined"
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
                        <TableCell>Zpráva</TableCell>
                        <TableCell>Tým</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Projekt</TableCell>
                        <TableCell>Stav projektu</TableCell>
                        <TableCell>Poznámka</TableCell>
                        <TableCell>Id</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teamsQuery.teams.map((team) => (
                        <React.Fragment key={team.id}>
                            <TableRow>
                                <TableCell  rowSpan={team.classrooms.length || 1}>
                                    <Message onClick={() => setMessageTeamId(team.id)} />
                                </TableCell>
                                <TableCell rowSpan={team.classrooms.length || 1}>
                                    <React.Fragment>
                                        {team.users.map((user) => (
                                            <React.Fragment key={user.id}>
                                                {user.activated ? `${user.firstname} ${user.lastname}` : `${user.email} (${user.securityCode})`}<br />
                                                <span style={{ color: '#9d9d9d' }}>{user.phone}, {user.email}</span><br/>
                                            </React.Fragment>
                                        ))}
                                        {!team.users || team.users.length < 2 ? (
                                            <Button
                                                size="small"
                                                onClick={() => setCreateUserTeam(team.id)}
                                                variant="outlined"
                                                style={{ height: '28px', marginTop: '4px' }}
                                            >
                                                Přidat člena
                                            </Button>
                                        ) : null}
                                    </React.Fragment>
                                </TableCell>
                                <TableCell  rowSpan={team.classrooms.length || 1}>
                                    {team.users.map((user) => (
                                        <React.Fragment key={user.id}>
                                            {user.region}<br /><br/>
                                        </React.Fragment>
                                    ))}
                                </TableCell>
                                {team.classrooms && team.classrooms[0] ? (
                                    <TableCell>
                                        {team.classrooms[0].classroomName}
                                    </TableCell>) : <TableCell>-</TableCell>
                                }
                                {team.classrooms && team.classrooms[0] ?
                                    <TableCell key={getActivePhase(team.classrooms[0]).id}>
                                        {`${getActivePhase(team.classrooms[0]).number}/${team.classrooms[0].phases.length}: ${getActivePhase(team.classrooms[0]).name}`}
                                    </TableCell> : <TableCell>-</TableCell>}
                                <TableCell rowSpan={team.classrooms.length || 1}>{team.note || '-'}</TableCell>
                                <TableCell rowSpan={team.classrooms.length || 1}>{team.id}</TableCell>
                            </TableRow>
                            {compose(
                                map((classroom) => (
                                    <React.Fragment key={classroom.id}>
                                        <TableRow>
                                            <TableCell>{classroom.classroomName}</TableCell>
                                            <TableCell key={getActivePhase(classroom).id}>
                                                {`${getActivePhase(classroom).number}/${classroom.phases.length}: ${getActivePhase(classroom).name}`}
                                            </TableCell>
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
                email
                firstname
                lastname
                activated
                securityCode
                phone
                region
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
