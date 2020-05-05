import React, { useState } from 'react';
import Layout from '../components/Layout';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import pathOr from 'ramda/src/pathOr';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Select from '@material-ui/core/Select';
import map from 'ramda/src/map';
import MenuItem from '@material-ui/core/MenuItem';
import Regions from '../constants/Regions';

const Budgets = ({ client }) => {
    const [year, setYear] = useState(2020);
    const [budgetMMA, setBudgetMMA] = useState(0);
    const [budgetMSE, setBudgetMSE] = useState(0);
    const [budgetEXHYP, setBudgetEXHYP] = useState(0);
    const [subscribed, setSubscribed] = useState(0);
    const [fairs, setFairs] = useState(0);
    const [toolboxes, setToolboxes] = useState(0);
    const [region, setRegion] = useState('');
    const [budgets, setBudgets] = useState(null);

    const fetchBudgets = () => {
        client.query({
            query: gql`query Budgets($year: Int!, $region: String!) {
                budgets(year: $year, region: $region) {
                    budgetMMA
                    budgetMSE
                    budgetEXHYP
                    overBudget
                    fairs
                    toolboxes
                    forgivenLoans
                }
            }`,
            fetchPolicy: 'network-only',
            variables: {
                year: parseInt(year),
                region,
            }
        }).then((res) => {
            setBudgets(pathOr({}, ['data', 'budgets'])(res));
        })
    }
    return (
        <Layout title="Budgety">
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                <FormControl margin="normal">
                    <InputLabel htmlFor="year">Rok</InputLabel>
                    <Input
                        id="year"
                        name="year"
                        value={year}
                        type="number"
                        onChange={(e) => setYear(e.target.value)}
                    />
                </FormControl>
                <FormControl margin="normal" required>
                    <InputLabel htmlFor="region">Region</InputLabel>
                    <Select
                        inputProps={{
                            id: 'region',
                            name: 'region'
                        }}
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                    >
                        {map((region) => (
                            <MenuItem value={region}>{region}</MenuItem>
                        ))(Regions)}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        fetchBudgets();
                    }}
                >
                    Načíst budgety
                </Button>
            </div>
            {budgets ? (
                <React.Fragment>
                    <Table style={{ width: 600 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Poč. budget</TableCell>
                                <TableCell>Čerpáno</TableCell>
                                <TableCell>Zbývá</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    MMA
                                </TableCell>
                                <TableCell>
                                    <FormControl margin="normal">
                                        <InputLabel htmlFor="budgetMMA">Budget MMA</InputLabel>
                                        <Input
                                            id="budgetMMA"
                                            name="budgetMMA"
                                            value={budgetMMA}
                                            type="number"
                                            onChange={(e) => setBudgetMMA(e.target.value)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['budgetMMA'])(budgets)}
                                </TableCell>
                                <TableCell>
                                    {budgetMMA - pathOr(0, ['budgetMMA'])(budgets)}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    MSE
                                </TableCell>
                                <TableCell>
                                    <FormControl margin="normal">
                                        <InputLabel htmlFor="budgetMSE">Budget MSE</InputLabel>
                                        <Input
                                            id="budgetMSE"
                                            name="budgetMSE"
                                            value={budgetMSE}
                                            type="number"
                                            onChange={(e) => setBudgetMSE(e.target.value)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['budgetMSE'])(budgets)}
                                </TableCell>
                                <TableCell>
                                    {budgetMSE - pathOr(0, ['budgetMSE'])(budgets)}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>
                                    EXHYP
                                </TableCell>
                                <TableCell>
                                    <FormControl margin="normal">
                                        <InputLabel htmlFor="budgetEXHYP">Budget EXHYP</InputLabel>
                                        <Input
                                            id="budgetEXHYP"
                                            name="budgetEXHYP"
                                            value={budgetEXHYP}
                                            type="number"
                                            onChange={(e) => setBudgetEXHYP(e.target.value)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['budgetEXHYP'])(budgets)}
                                </TableCell>
                                <TableCell>
                                    {budgetEXHYP - pathOr(0, ['budgetEXHYP'])(budgets)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Nad rámec
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['overBudget'])(budgets)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Předplaceno
                                </TableCell>
                                <TableCell>
                                    <FormControl margin="normal">
                                        <InputLabel htmlFor="subscribed">Předplaceno</InputLabel>
                                        <Input
                                            id="subscribed"
                                            name="subscribed"
                                            value={subscribed}
                                            type="number"
                                            onChange={(e) => setSubscribed(e.target.value)}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Celkem proinvestováno
                                </TableCell>
                                <TableCell>
                                    {parseInt(budgetMMA) + parseInt(budgetMSE) + parseInt(budgetEXHYP) + pathOr(0, ['overBudget'])(budgets) + parseInt(subscribed)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Cena</TableCell>
                                <TableCell>Počet</TableCell>
                                <TableCell>Celkem</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Minibox
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Objednané toolboxy
                                </TableCell>
                                <TableCell>
                                    <FormControl margin="normal">
                                        <InputLabel htmlFor="toolboxes">Cena toolboxu</InputLabel>
                                        <Input
                                            id="toolboxes"
                                            name="toolboxes"
                                            value={toolboxes}
                                            type="number"
                                            onChange={(e) => setToolboxes(e.target.value)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['toolboxes'])(budgets)}
                                </TableCell>
                                <TableCell>
                                    {parseInt(toolboxes) * pathOr(0, ['toolboxes'])(budgets)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Jarmarky
                                </TableCell>
                                <TableCell>
                                    <FormControl margin="normal">
                                        <InputLabel htmlFor="fairs">Cena jarmarku</InputLabel>
                                        <Input
                                            id="fairs"
                                            name="fairs"
                                            value={fairs}
                                            type="number"
                                            onChange={(e) => setFairs(e.target.value)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['fairs'])(budgets)}
                                </TableCell>
                                <TableCell>
                                    {parseInt(fairs) * pathOr(0, ['fairs'])(budgets)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Odpuštěný kapitál
                                </TableCell>
                                <TableCell>
                                    {pathOr(0, ['forgivenLoans'])(budgets) * 3000}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </React.Fragment>
            ) : null}
        </Layout>
    );
}

export default withApollo(Budgets);
