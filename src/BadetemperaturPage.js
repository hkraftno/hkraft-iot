import React from 'react';
import BadetemperaturCard  from './BadetemperaturCard';
import WeatherCard  from './WeatherCard';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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


function BadetemperaturPage(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
          <p />
        <Grid container justify="center" spacing={8}  className={classes.root} alignItems="stretch"  >
            <Grid item xs={12}>
            <Typography variant="h2" >Badetemperaturer</Typography>
            <hr />
            <Typography variant="h4" >Eivindsvatnet</Typography>
            </Grid>
            <Grid item xs={11} sm={5} md={4} >
                <BadetemperaturCard />
            </Grid>
            <Grid item xs={11} sm={5} md={4} >
                <WeatherCard />
            </Grid>
        </Grid>
        <hr />
      </div>
    );

  }

  BadetemperaturPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(BadetemperaturPage);
