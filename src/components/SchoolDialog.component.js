import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import compose from "ramda/src/compose";
import map from "ramda/src/map";
import Button from "@material-ui/core/Button";
import filter from "ramda/src/filter";
import includes from "ramda/src/includes";
import propOr from "ramda/src/propOr";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import schoolAttributes from "../constants/schoolAttributes";

const SchoolDialog = ({ school, setSchool, schoolSearchDialog, setSchoolSearchDialog, schoolsQuery }) => {

    const [search, setSearch] = useState(false);

    return (
        <Dialog
            onClose={() => setSchoolSearchDialog(false)}
            open={schoolSearchDialog}
        >
            <DialogContent style={{ minWidth: '500px', minHeight: '500px' }}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="search">Hledat (alespoň 3 znaky)</InputLabel>
                    <Input
                        id="search"
                        name="search"
                        value={school.search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </FormControl>
                {search && search.length >= 3 ? (
                    compose(
                        map((schoolRec) => (
                            <Button
                                fullWidth
                                key={schoolRec.id}
                                onClick={() => {
                                    setSchool(schoolRec);
                                    setSearch('');
                                    setSchoolSearchDialog(false);
                                }}
                            >
                                {schoolRec.name + ", " + schoolRec.city + ", " + schoolRec.street}
                            </Button>
                        )),
                        filter((schoolRec) => (
                            includes(search.toLowerCase())((schoolRec.street || '').toLowerCase()) ||
                            includes(search.toLowerCase())((schoolRec.city || '').toLowerCase()) ||
                            includes(search.toLowerCase())((schoolRec.name || '').toLowerCase()) ||
                            includes(search.toLowerCase())((schoolRec.region || '').toLowerCase())
                        )),
                        propOr([], 'schools'),
                    )(schoolsQuery)
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

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
    schoolsQuery
)(SchoolDialog);