import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import thermometer from './weather/thermometer.svg'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import './App.css';


const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),

  freddan:{
    fontSize: '6rem',
  },

  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    
   
    
  },
  test:{
    marginBottom:0,
    fontSize: '6rem',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});


class SampleCard extends Component {
  state = { data: null };
  
  render() {
    const { classes } = this.props;
  
    return (
    <Paper  elevation={4}  className={classes.paper}>
      <Grid container alignItems="center" justify="center" >
      <Grid item xs={12}>
                <Typography variant="h4" >
                  Badetemperatur
                  </Typography>
        </Grid>

        <Grid item xs={12}>
          <img alt="termometer" src={thermometer} height="100px"/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="title" align="center" gutterBottom>
          Bade-Anna har tatt vinterferie.
          </Typography>      
          <Typography align="center" gutterBottom>
Bade-Anna har tatt en velfortjent vinterferie.
          </Typography>
        </Grid>
      
      </Grid>       
    </Paper>
     
    );
  }
}
SampleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SampleCard);
