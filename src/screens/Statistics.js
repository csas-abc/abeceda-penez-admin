import React from 'react';
import { useSnackbar } from 'notistack';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import Layout from '../components/Layout';

const Statitics = ({ client }) => {
    const { enqueueSnackbar } = useSnackbar();
    return (
        <Layout title="Statistika">
            <Button
                variant="raised"
                color="primary"
                style={{ margin: '0 10px' }}
                onClick={() => {
                    enqueueSnackbar(
                        'Odkaz na soubor byl odeslán e-mailem',
                        {
                            variant: 'success',
                            autoHideDuration: 4000,
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'top',
                            },
                        },
                    );
                    client.query({
                        query: gql`
                        query ExportSchools { exportSchools }`
                    })
                }}
            >
                Unikátní školy
            </Button>
            <Button
                variant="raised"
                color="primary"
                style={{ margin: '0 10px' }}
                onClick={() => {
                    enqueueSnackbar(
                        'Odkaz na soubor byl odeslán e-mailem',
                        {
                            variant: 'success',
                            autoHideDuration: 4000,
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'top',
                            },
                        },
                    );
                    client.query({
                        query: gql`
                        query ExportMoney { exportMoney }`
                    })
                }}
            >
                Výdělky po regionech
            </Button>
            <Button
                variant="raised"
                color="primary"
                style={{ margin: '0 10px' }}
                onClick={() => {
                    enqueueSnackbar(
                        'Odkaz na soubor byl odeslán e-mailem',
                        {
                            variant: 'success',
                            autoHideDuration: 4000,
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'top',
                            },
                        },
                    );
                    client.query({
                        query: gql`
                        query ExportEmails { exportEmails }`
                    })
                }}
            >
                E-maily účastníků
            </Button>
        </Layout>
    );
};

const exportSchools = graphql(gql`{ exportSchools }`);

export default withApollo(Statitics);
