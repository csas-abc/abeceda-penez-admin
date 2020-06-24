import React from 'react';
import { useSnackbar } from 'notistack';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import Layout from '../components/Layout';

const Statitics = ({ client }) => {
    const { enqueueSnackbar } = useSnackbar();

    const displaySnackbar = query => {
        
        client.query({
            query: gql`${query}`
        }).then(() => {
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
        }).catch(err => {
            enqueueSnackbar(
                'Chyba při odesílání',
                {
                    variant: 'error',
                    autoHideDuration: 4000,
                    anchorOrigin: {
                        horizontal: 'center',
                        vertical: 'top',
                    },
                },
            );
        });
    };
    const ReportButton = ({value, query}) => {
        return (
            <Button
                variant="contained"
                color="primary"
                style={{ margin: '10px' }}
                onClick={() => displaySnackbar(`${query}`)}
            >
                {value}
            </Button>
        );
    }

    return (
        <Layout title="Statistika">
            <ReportButton value="Unikátní školy" query="query ExportSchools { exportSchools }"></ReportButton>
            <ReportButton value="Výdělky po regionech" query="query ExportMoney { exportMoney }"></ReportButton>
            <ReportButton value="E-maily účastníků" query="query ExportEmails { exportEmails }"></ReportButton>
            <ReportButton value="Kontakty" query="query ExportContacts { exportContacts }"></ReportButton>
            <ReportButton value="Přehled škol/tříd" query="query ExportSchoolsReview { exportSchoolsReview }"></ReportButton>
            <ReportButton value="Pobočky" query="query ExportBranches { exportBranches }"></ReportButton>
        </Layout>
    );
};

export default withApollo(Statitics);
