import React, { Component } from 'react';
import { api } from './fire';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'react-moment';

import sensor_icon from './sensor/sensor.svg'
import thermometer from './weather/thermometer.svg'
import humidity from './sensor/humidity.svg'
import battery_0 from './sensor/battery-0.svg'
import battery_25 from './sensor/battery-25.svg'
import battery_50 from './sensor/battery-50.svg'
import battery_75 from './sensor/battery-75.svg'
import battery_100 from './sensor/battery-100.svg'

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

const devEUI = '70B3D580A010638B';

class SensorCard extends Component {
  state = { data: null };


  unsubscibe = null;

  componentDidMount() {
    this.unsubscibe = api
    .collection('latest')
    .doc(devEUI)
    .onSnapshot(doc =>
      this.setState({
        data: doc.data(),
      })
    );
  }
  componentWillUnmount() {
    this.unsubscibe && this.unsubscibe();
  }
  render() {
    const { classes } = this.props;
    if (!this.state.data ) { return (<CircularProgress className={classes.progress} size={50} />)}
    var battery_icon = battery_0;
    if (this.state.data.battery_level > 90) {
      battery_icon = battery_100
    } else if (this.state.data.battery_level > 60) {
      battery_icon = battery_75
    } else if (this.state.data.battery_level > 25) {
      battery_icon = battery_50
    }
    else if (this.state.data.battery_level > 10) {
      battery_icon = battery_25
    }
    return (
    <Paper  elevation={1}  className={classes.paper}>
      <Grid container alignItems="center" justify="center" >
      <Grid item xs={12}>
            <Typography>
            <img alt="devEUI" src={sensor_icon} height="30px"/>&nbsp;{devEUI}<hr />
            </Typography>
      </Grid>
      <Grid item >
          <img alt="battery" src={battery_icon} height="30px" />
      </Grid>
      <Grid item >
        <Typography>
          {Math.round(this.state.data.battery_level)}% &nbsp;&nbsp;
        </Typography>
      </Grid>
      <Grid item >
        <img alt="humidity" src={humidity} height="30px" />
      </Grid>
      <Grid item >
        <Typography>
          {this.state.data.humidity}% &nbsp;&nbsp;
        </Typography>
      </Grid>
      <Grid item >
          <img alt="thermometer" src={thermometer} height="30px" />
      </Grid>
       <Grid item >
        <Typography>
          {Math.round(this.state.data.temperature)}°
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Typography variant="caption" align="center">
          <hr />
          Siste status <Moment format="DD/MM/YYYY HH:mm">{new Date(this.state.data.timestamp)}</Moment>
        </Typography>
      </Grid>
      </Grid>
    </Paper>
    );
  }
}
SensorCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SensorCard);
