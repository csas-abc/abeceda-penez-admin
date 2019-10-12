import React, { useState } from 'react';
import PropTypes from 'prop-types';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';
import compose from 'ramda/src/compose';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import UploadPhotoDialog from './UploadPhotosDialog';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '100%',
        height: '100%',
    },
});

const ProjectFiles = ({ classroomQuery, classes }) => {
    const classroom = classroomQuery.classroom || {};
    const [uploadPhoto, setUploadPhoto] = useState(false);
    return (
        <div>
            {uploadPhoto ? (
                <UploadPhotoDialog
                    classroom={classroom}
                    onClose={() => {
                        console.log('ON CLOSE');
                        setUploadPhoto(false);
                    }}
                />
            ) : null}
            <Button
                variant="contained"
                color="primary"
                style={{
                    margin: '10px 0',
                }}
                onClick={() => {
                    setUploadPhoto(true);
                }}
            >
                Nahrát fotky
            </Button>
            <div className={classes.root}>
                <GridList cellHeight={200} className={classes.gridList} cols={5}>
                    {map((phase) => (
                            compose(
                                map((file) => (
                                    <GridListTile key={file.id} cols={1}>
                                        <img src={`https://abeceda.adane.cz${file.path}`} alt={file.name} />
                                    </GridListTile>
                                )),
                                filter((file) => file.fileType === 'PHOTO'),
                            )(phase.files || [])
                    ))(classroom.phases || [])}
                </GridList>
            </div>
        </div>
    );
};

ProjectFiles.propTypes = {
    classroom: PropTypes.object,
};

const classroomsQuery = graphql(gql`
    query Classroom($id: ID!) {
        classroom(id: $id) {
            id
            phases {
                id
                files {
                    id
                    name
                    fileType
                    path
                    author {
                        id
                        firstname
                        lastname
                    }
                }
            }
        }
    }
`, {
    name: 'classroomQuery',
    options: (props) => ({
        fetchPolicy: 'cache-and-network',
        variables: {
            id: props.classroom.id,
        },
    }),
});

export default compose(
    classroomsQuery,
    withStyles(styles),
)(ProjectFiles);
