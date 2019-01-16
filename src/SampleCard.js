import React, { Component } from 'react';
import { api } from './fire';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import thermometer from './weather/thermometer.svg'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'react-moment';

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

const firmwareType = 'SenlabH';

class SampleCard extends Component {
  state = { data: null };
  
  async componentDidMount() {
    const result = await api.collection(firmwareType).orderBy("timestamp", "desc").limit(1).get();
    var data = result.docs[0].data();
    this.setState({
      data: data
    });
  }
  render() {
    const { classes } = this.props;
    if (!this.state.data ) { return (<CircularProgress className={classes.progress} size={50} />)}
    return (
    <Paper  elevation={4}  className={classes.paper}>
      <Grid container alignItems="center" justify="center" >
      <Grid item xs={12}>
                <Typography variant="h4" >
                  Badetemperatur
                  </Typography>
        </Grid>

        <Grid item >
          <img alt="termometer" src={thermometer} height="100px"/>
        </Grid>
        <Grid item >
        <Typography variant="h2" className={classes.test} gutterBottom>
      
                  {Math.round(this.state.data.temperature)}°
                
                  </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
        
                <Typography variant="caption" align="center">
                  Sist måling gjort <Moment format="DD/MM/YYYY HH:mm">{new Date(this.state.data.timestamp)}</Moment>
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
