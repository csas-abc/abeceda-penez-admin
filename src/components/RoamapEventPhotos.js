import React, { useState } from 'react';
import PropTypes from 'prop-types';
import map from 'ramda/src/map';
import compose from 'ramda/src/compose';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import UploadRoadmapFileDialog from './UploadRoadmapFileDialog';

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

const RoadmapEventPhotos = ({ event, classes, editDisabled }) => {
    const [uploadPhoto, setUploadPhoto] = useState(false);
    return (
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            {uploadPhoto ? (
                <UploadRoadmapFileDialog
                    event={event}
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
                disabled={editDisabled}
            >
                Nahrát fotky
            </Button>
            <div className={classes.root}>
                <GridList cellHeight={200} className={classes.gridList} cols={5}>
                    {map((file) => (
                        <GridListTile
                            key={file.id}
                            cols={1}
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(`https://abeceda.adane.cz${file.path}`, '_blank')}
                        >
                            <img src={`https://abeceda.adane.cz${file.path}`} alt={file.name} />
                        </GridListTile>
                    ))(event.photos || [])}
                </GridList>
            </div>
        </div>
    );
};

RoadmapEventPhotos.propTypes = {
    event: PropTypes.object,
};

export default compose(
    withStyles(styles),
)(RoadmapEventPhotos);
