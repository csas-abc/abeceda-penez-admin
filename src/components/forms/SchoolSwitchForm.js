import React, { useState } from "react";
import styled from "styled-components";
import SchoolForm from "./SchoolForm";
import TabPanel from "../TabPanel";
import EditContactForm from '../forms/EditContactForm';
import Typography from '@material-ui/core/Typography';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import join from "ramda/src/join";
import propOr from "ramda/src/propOr";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import compose from "ramda/src/compose";
import map from "ramda/src/map";
import Button from "@material-ui/core/Button";
import filter from "ramda/src/filter";
import includes from "ramda/src/includes";
import gql from "graphql-tag";
import schoolAttributes from "../../constants/schoolAttributes";
import {graphql} from "react-apollo";

const List = styled.ul`
list-style: none;
//margin: 0 auto;       ///////////
//width: 500px;              List centered
//text-align: center;  ///////////
padding-top: 30px;
`
const Item = styled.li`
&:hover {
border-bottom: ${props => (props.active ? '' : '1px solid #4050B5' )};
}
color: ${props => (props.active ? '#4050B5' : '#E1E1E1' )};
border-bottom: ${props => (props.active ? '1px solid #4050B5' : '' )};
float: left;
margin: 10px;
padding: 0 20px 0 20px;
font-size: 1.8em;
`

const SchoolSwitchForm = ({
  editDisabled,
  classroom,
  classroomId,
  contact,
  onClose,
  schoolsQuery
  }) => {

    const [list, toggleList] = useState([{
        item: 'Ředitel a zástupce',
        active: true,
        id: 0
    },
    {
        item: 'Učitel',
        active: false,
        id: 1
    }]);
    const [schoolSearchDialog, setSchoolSearchDialog] = useState(false);
    const [search, setSearch] = useState(false);
    const [school, setSchool] = useState(propOr({}, 'school')(classroom));

    return (
       <>
           {schoolSearchDialog ? (
               <Dialog
                   onClose={() => setSchoolSearchDialog(false)}
                   open={schoolSearchDialog}
               >
                   <DialogContent style={{ minWidth: '500px', minHeight: '500px', paddingBottom: "0 !important" }}>
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
           ) : null}

           <FormControl margin="normal" required fullWidth>
               <InputLabel style={{position: "relative", top: "-10px"}} htmlFor="school">Název</InputLabel>
               <Input
                   id="school"
                   name="school"
                   value={school.name}
                   // onChange={() => {}}
                   onClick={() => {
                       setSchoolSearchDialog(true);
                   }}
               />
           </FormControl>
           <FormControl margin="normal" fullWidth>
               <InputLabel htmlFor="address">Adresa</InputLabel>
               <Input
                   id="address"
                   name="address"
                   value={join(', ')([
                       propOr('-', 'street')(school),
                       propOr('-', 'city')(school),
                   ])}
                   onChange={() => {}}
                   onClick={() => {
                       setSchoolSearchDialog(true);
                   }}
               />
           </FormControl>
          <List>
              {list.map(el => {
                  return (
                  <Item key={el.id} active={el.active} onClick={() => {
                      if (!el.active) {
                      toggleList([{
                          item: 'Ředitel a zástupce',
                          active: !list[0].active,
                          id: 0
                      },
                          {
                              item: 'Učitel',
                              active: !list[1].active,
                              id: 1
                          }]);
                      }
                  }}>{el.item}</Item>
                  );
              })}

          </List>
          <br/>
          <br/>
          <br/>
           {
               list[0].active ? <SchoolForm
                   // school={propOr({}, 'school')(classroom)}
                   school={school}
                   editDisabled={editDisabled}
                   classroom={classroom}
                               /> : (
                     <>
                       <EditContactForm
                           contact={contact}
                           classroomId={classroomId}
                           onClose={onClose}
                           editDisabled={editDisabled}
                       />
                     </>
               )
           }
       </>
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
)(SchoolSwitchForm);