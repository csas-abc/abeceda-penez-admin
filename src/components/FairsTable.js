import React, { useState } from 'react';
import moment from 'moment';
import defaultTo from 'ramda/src/defaultTo';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import contains from 'ramda/src/contains';
import compose from 'ramda/src/compose';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import pluck from 'ramda/src/pluck';
import FairModal from './FairModal';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const FairsTable = ({
    classes,
    fairsQuery,
    meQuery,
}) => {
    const [fairDetail, setFairDetail] = useState(null);
    const isAdmin = compose(
        contains('ADMIN'),
        pluck('name'),
        defaultTo([]),
        path(['me', 'roles']),
    )(meQuery);
    if (fairsQuery.loading) return <CircularProgress />;
    if (fairsQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <React.Fragment>
            {fairDetail ? (
                <FairModal classroom={fairDetail} onClose={() => setFairDetail(null)} />
            ) : null }
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum jarmarku</TableCell>
                        <TableCell>Adresa pobočky</TableCell>
                        <TableCell>Postavení stánků</TableCell>
                        <TableCell>Začátek jarmarku</TableCell>
                        <TableCell>Konec jarmarku</TableCell>
                        <TableCell>Kontakt pobočka</TableCell>
                        <TableCell>Kontakt tým</TableCell>
                        <TableCell>Poznámka</TableCell>
                        <TableCell>Elektřina</TableCell>
                        <TableCell>Stav záboru</TableCell>
                        <TableCell>Poznámka k záboru</TableCell>
                        <TableCell>Prostor ČS?</TableCell>
                        <TableCell>Počet žáků</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map((fair) => (
                        <TableRow key={fair.id} onClick={() => isAdmin ? setFairDetail(fair) : null}>
                            <TableCell>
                                {path(['fairDate'])(fair) ? moment(fair.fairDate).format('L') : '-' }
                            </TableCell>
                            <TableCell>
                                {path(['branchAddress'])(fair) || '-'}
                            </TableCell>
                            <TableCell>
                                {path(['kioskReadyTime'])(fair) ? moment(fair.kioskReadyTime).format('LT') : '-' }
                            </TableCell>
                            <TableCell>
                                {path(['fairTime'])(fair) ? moment(fair.fairTime).format('LT') : '-' }
                            </TableCell>
                            <TableCell>
                                {path(['fairEnd'])(fair) ? moment(fair.fairEnd).format('LT') : '-' }
                            </TableCell>
                            <TableCell>
                                {path(['branchRepresentativeName'])(fair) || '-'} <br/>
                                <span style={{ color: '#9d9d9d' }}>{path(['branchRepresentativePhone'])(fair) || '-'}</span>
                            </TableCell>
                            <TableCell>
                                {compose(
                                    map((user) => (
                                        <React.Fragment key={user.id}>
                                            {user.activated ? `${user.firstname} ${user.lastname}` : user.email}<br />
                                            <span style={{ color: '#9d9d9d' }}>{user.phone}, {user.email}</span><br/>
                                        </React.Fragment>
                                    )),
                                    defaultTo([]),
                                    path(['team', 'users']),
                                )(fair)}
                            </TableCell>
                            <TableCell>
                                {path(['fairNote'])(fair) || '-'}
                            </TableCell>
                            <TableCell>
                                {path(['fairElectricity'])(fair) || '-'}
                            </TableCell>
                            <TableCell>
                                {path(['fairAnnexationState'])(fair) || '-'}
                            </TableCell>
                            <TableCell>
                                {path(['fairAnnexationNote'])(fair) || '-'}
                            </TableCell>
                            <TableCell>
                                {path(['kioskPlace'])(fair) || '-'}
                            </TableCell>
                            <TableCell>
                                {path(['childrenCount'])(fair) || '-'}
                            </TableCell>
                        </TableRow>
                    ))(fairsQuery.fairs)}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

const meQuery = graphql(gql`
    {
        me {
            id
            email
            roles {
                name
            }
        }
    }
`, {
    name: 'meQuery'
});

const fairsQuery = graphql(gql`
    {
        fairs {
            id
            fairDate
            fairTime
            fairEnd
            kioskReadyTime
            branchAddress
            branchRepresentativeName
            branchRepresentativeEmail
            branchRepresentativePhone
            childrenCount
            team {
                id
                users {
                    id
                    activated
                    firstname
                    lastname
                    email
                    phone
                }
            }
            fairNote
            fairElectricity
            fairAnnexationState
            fairAnnexationNote
            kioskPlace
        }
    }
`, {
    name: 'fairsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});



export default compose(
    withStyles(styles),
    fairsQuery,
    meQuery,
)(FairsTable);
