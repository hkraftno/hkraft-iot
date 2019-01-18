import React from 'react';
import SensorCard  from './SensorCard';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      flexGrow: 1,
      margin: 'auto',
      paddingBottom:'30px',
    },    

    fredrik:{
      flexGrow: 1,
      margin: '8px',
    },
  });


function SensorPage(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
        <p />
        <Grid container justify="center" spacing={8}  className={classes.root} alignItems="stretch"  >
            <Grid item xs={11} sm={5} md={4} >
                <SensorCard />
            </Grid>
        </Grid>
      </div>
    );

  }

  SensorPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(SensorPage);
