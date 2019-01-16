import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactGA from 'react-ga';
import moment from 'moment';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  test: {
    marginBottom: 0,
    fontSize: '6rem',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

const yrno = require('yr.no-forecast')({
  request: {
    // make calls to locationforecast timeout after 15 seconds
    timeout: 15000
  }
});

const LOCATION = {
  // This is Eivindsvatnet
  lat: 53.3478,
  lon: 6.2597
};

class WeatherCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }
  async componentDidMount() {

    yrno.getWeather(LOCATION)
      .then((weather) => {
        // Get a weather data point for a given time between now and 9 days ahead
        weather.getForecastForTime(new Date())
          .then(data => this.setState({ data }))
      })
      .catch((e) => {
        console.log('an error occurred!', e);
      });
  }
  render() {
    const { classes } = this.props;
    // console.log('current weather', JSON.stringify(this.state.data));

    if (!this.state.data) { return (<CircularProgress className={classes.progress} size={50} />) }
    var icon = './weather/' + this.state.data.icon + '.svg';
    var format = 'HH:mm';
    var nowAsString = moment().format(format);
    var now = moment(nowAsString, format),
      nightStart = moment('00:00', format),
      nightStop = moment('08:00', format);
    if (now.isBetween(nightStart, nightStop)) {
      icon = './weather/' + this.state.data.icon + 'Night.svg';;
    }
    return (
      <Paper elevation={4} className={classes.paper} >
        <Grid container alignItems="center" justify="center" >
          <Grid item xs={12}>
            <Typography variant="h4" >Været</Typography>
          </Grid>
          <Grid item  >
            <div>
              <img src={require(`${icon}`)} alt={this.state.data.icon} height="100px" />
            </div>
          </Grid>
          <Grid item >
            <Typography variant="h2" className={classes.test} gutterBottom>&nbsp;{this.state.data.temperature.value}°</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant="caption" align="center">
              Værvarsel fra <ReactGA.OutboundLink
                eventLabel="YR"
                to="https://www.yr.no"
                target="_blank">Yr levert av Meteorologisk institutt og NRK</ReactGA.OutboundLink>.<br />
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );

  }
}

export default withStyles(styles)(WeatherCard);
