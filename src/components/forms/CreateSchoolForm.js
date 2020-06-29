import React, { useState } from 'react';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo';
import Select from '@material-ui/core/Select';
import replace from 'ramda/src/replace';
import map from 'ramda/src/map';
import MenuItem from '@material-ui/core/MenuItem';
import { useSnackbar } from 'notistack';
import schoolAttributes from '../../constants/schoolAttributes';
import Regions from '../../constants/Regions';
import SchoolStatuses from '../../constants/SchoolStatuses';
import SchoolStatusesHints from '../../constants/SchoolStatusesHints';
import Typography from '@material-ui/core/Typography';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateSchoolForm = ({
    classes,
    createSchoolMutation,
    createContactMutation,
    schoolsQuery,
    onClose,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [note, setNote] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [status, setStatus] = useState('');

    const [directorName, setDirectorName] = useState('');
    const [directorPhone, setDirectorPhone] = useState('');
    const [directorEmail, setDirectorEmail] = useState('');

    const [alternateName, setAlternateName] = useState('');
    const [alternatePhone, setAlternatePhone] = useState('');
    const [alternateEmail, setAlternateEmail] = useState('');

    

    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                if (name === '' || region === '' || street === '' || city === '' || status === '') {
                    e.preventDefault();
                    enqueueSnackbar(
                        'Vyplňte prosím povinná pole',
                        {
                            variant: 'error',
                            autoHideDuration: 4000,
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'top',
                            },
                        }
                    )                    
                } else {
                    e.preventDefault();
                    setLoading(true);
                    let exists = false;
                    schoolsQuery.schools.forEach(school => {
                        let zipCodeExisting = school.city
                        if (zipCodeExisting === null) {
                            zipCodeExisting = '';
                        }
                        zipCodeExisting = zipCodeExisting.slice(0, 6).replace(/ /g,'');
                        const zipCodeNew = city.slice(0, 6).replace(/ /g,'');
                        if (zipCodeExisting === zipCodeNew && school.street === street) {
                            exists = true;
                        }
                    });
                    if (exists) {
                        enqueueSnackbar(
                            'Škola s touto ulicí a PSČ již existuje',
                            {
                                variant: 'error',
                                autoHideDuration: 4000,
                                anchorOrigin: {
                                    horizontal: 'center',
                                    vertical: 'top',
                                },
                            }
                            ) 
                            onClose();
                    } else {
                        createSchoolMutation({
                            variables: {
                                name,
                                region,
                                note,
                                street,
                                city,
                                status,
                            }
                        }).then((red) => {
                            const contactsRequests = [
                                createContactMutation({
                                    variables: {
                                        name: directorName,
                                        phone: directorPhone,
                                        email: directorEmail,
                                        schoolId: red.data.createSchool.id,
                                        contactType: 'DIRECTOR',
                                    }
                                }),
                                createContactMutation({
                                    variables: {
                                        name: alternateName,
                                        phone: alternatePhone,
                                        email: alternateEmail,
                                        schoolId: red.data.createSchool.id,
                                        contactType: 'ALTERNATE',
                                    }
                                }),
                            ];
                            return Promise.all(contactsRequests);
                        }).then(() => {
                            setLoading(false);
                            onClose();
                            enqueueSnackbar(
                                'Škola byla úspěšně uložena',
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
                            setLoading(false);
                            enqueueSnackbar(replace('GraphQL error: ', '')(e.message), { variant: 'error' });
                            console.error('ERROR', e);
                        }) 
                    }
                    
                }
                
            }}
        >
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="name">Název*</InputLabel>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="region">Region*</InputLabel>
                <Select
                    inputProps={{
                        id: 'region',
                        name: 'region'
                    }}
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    {map((region) => (
                        <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))(Regions)}
                </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="note">Poznámka</InputLabel>
                <Input
                    id="note"
                    name="note"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="street">Ulice a č.p.*</InputLabel>
                <Input
                    id="street"
                    name="street"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="city">PSČ a město *</InputLabel>
                <Input
                    id="city"
                    name="city"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="status">Status*</InputLabel>
                <Select
                    inputProps={{
                        id: 'schoolStatus',
                        name: 'schoolStatus'
                    }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {map((schoolStatus) => (
                        <MenuItem key={schoolStatus} value={schoolStatus}><b>{schoolStatus}</b>&nbsp;(<i>{SchoolStatusesHints[schoolStatus]}</i>)</MenuItem>
                    ))(SchoolStatuses)}
                </Select>
            </FormControl>

            <Typography variant="headline" style={{ marginTop: '24px', marginBottom: 0 }}>
                Ředitel
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorName">Jméno a příjmení</InputLabel>
                <Input
                    id="directorName"
                    name="directorName"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorPhone">Telefon</InputLabel>
                <Input
                    id="directorPhone"
                    name="directorPhone"
                    value={directorPhone}
                    onChange={(e) => setDirectorPhone(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorEmail">E-mail</InputLabel>
                <Input
                    id="directorEmail"
                    name="directorEmail"
                    value={directorEmail}
                    onChange={(e) => setDirectorEmail(e.target.value)}
                />
            </FormControl>

            <Typography variant="headline" style={{ marginTop: '24px', marginBottom: 0 }}>
                Zástupce
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="alternateName">Jméno a příjmení</InputLabel>
                <Input
                    id="alternateName"
                    name="alternateName"
                    value={alternateName}
                    onChange={(e) => setAlternateName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="alternatePhone">Telefon</InputLabel>
                <Input
                    id="alternatePhone"
                    name="alternatePhone"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="alternateEmail">E-mail</InputLabel>
                <Input
                    id="alternateEmail"
                    name="alternateEmail"
                    value={alternateEmail}
                    onChange={(e) => setAlternateEmail(e.target.value)}
                />
            </FormControl>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
                disabled={loading}
            >
                {loading ? <CircularProgress size="small" /> : null} Uložit
            </Button>
        </form>
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

const createSchoolMutation = gql`
    mutation CreateSchool(
        $name: String
        $region: String
        $note: String
        $street: String
        $city: String
        $status: String
    ) {
        createSchool(
            data: {
                name: $name
                region: $region
                note: $note
                street: $street
                city: $city
                status: $status
            }
        ) {
            ${schoolAttributes}
        }
    }
`;

const createContactMutation = gql`
    mutation CreateContact(
        $name: String
        $email: String
        $phone: String
        $schoolId: ID!
        $contactType: String!
    ) {
        createContact(
            data: {
                name: $name
                phone: $phone
                email: $email
                schoolId: $schoolId
                contactType: $contactType
            }
        ) {
            id
            name
            phone
            email
        }
    }
`;

const schoolsQuery = graphql(gql`
    {
        schools {
            ${schoolAttributes}
        }
    }
`, {
    name: 'schoolsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default compose(
    meQuery,
    schoolsQuery,
    graphql(
        createSchoolMutation,
        {
            name: 'createSchoolMutation',
        },
    ),
    graphql(
        createContactMutation,
        {
            name: 'createContactMutation',
        },
    ),
    
    withStyles(styles),
)(CreateSchoolForm);
