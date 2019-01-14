import React, { Component } from 'react';
import { api } from './fire';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { LineChart, Line, YAxis, XAxis,ResponsiveContainer } from 'recharts';
import moment from 'moment'
import Button from '@material-ui/core/Button';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';



import './App.css';




const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingBottom:'100px'
  },
  button: {
    margin: theme.spacing.unit,
  },

  freddan:{
    fontSize: '7rem',
  },

  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    
    margin:'auto',
    marginTop: '8px',
    
    
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});


class SampleStats extends Component {
  state = { data: null };
  constructor(props) {
    super(props);
  this.today = this.today.bind(this);
  this.sevenDay = this.sevenDay.bind(this);
  this.thirtyDay = this.thirtyDay.bind(this);
  }

  async hentData(startDato, formatX, buttonC){
    const result = await api.collection('samples').where('published', '>', startDato).get();
    var step = 1;
    var NumberOfPoints = 200;
    if(result.docs.length> NumberOfPoints){
      step = result.docs.length/NumberOfPoints;
      step = Math.floor( step );
      console.log("Steps=", step);
    }
    
    var dataSamples = [];
    
    for(var i = 0; i<result.docs.length; i++ )
    {
      
      if(i % step === 0)
      var tempData = result.docs[i].data()
      tempData.number = tempData.published.getTime();
      dataSamples.push(tempData);
      

    }
    var data = {};
    data.dataSamples = dataSamples;
    data.formatX = formatX;
    data.buttonC = buttonC;

    this.setState({
      data: data,
    });
  }
  
  componentDidMount() {
    //var startDato = new Date();
    //startDato.setDate(startDato.getDate() - 7);
    //console.log("StartDato ",startDato);
    //this.hentData(startDato, 'D/M HH:mm', this.buttonDefault());
    //this.today();
    this.sevenDay();
  }

  setTrack(range){
    ReactGA.event({
      category: 'Stats Navigation',
      action: range,
      
  });
  }

  today(){
    
      var buttonC ={};
      buttonC.today="primary";
      buttonC.seven="default";
      buttonC.thirty="default";
    var startDato = new Date();
    
    startDato.setHours(0,0,0,0);
    console.log("StartDato ",startDato);
    this.hentData(startDato, 'HH:mm',buttonC);
    this.setTrack('Today');
  }

  sevenDay(){
    var startDato = new Date();
    startDato.setDate(startDato.getDate() - 7);
    console.log("StartDato ",startDato);
    this.hentData(startDato, 'D/M HH:mm',this.buttonDefault());
    this.setTrack('Seven days');
  }
  thirtyDay(){
    var buttonC = {};
    buttonC.today="default";
    buttonC.seven="default";
    buttonC.thirty="primary";
    var startDato = new Date();
    startDato.setDate(startDato.getDate() - 30);
    console.log("StartDato ",startDato);
    this.hentData(startDato, 'D/M HH:mm',buttonC);
    this.setTrack('Thirty Days');
  }

  buttonDefault(){
    var buttonC = {};
    buttonC.today="default";
    buttonC.seven="primary";
    buttonC.thirty="default";
    return buttonC;
  }


  render() {
    const { classes } = this.props;
    if (!this.state.data ) { return (<CircularProgress className={classes.progress} size={50} />) }
    return (
      <Grid container justify="center" spacing={8}  className={classes.root} alignItems="stretch"  >
        <Grid item xs={11}>
          <Paper  className={classes.paper}>
          <Typography variant="h4" >
              {this.props.title}
          </Typography>
 
          <ResponsiveContainer width='95%' aspect={5/2} >
            <LineChart  data={this.state.data.dataSamples}>
              <Line type="monotone" dataKey={this.props.measure} stroke="#8884d8" dot={false} />
              <YAxis type="number" domain = {['auto', 'auto']}/>
              <XAxis
              dataKey = 'number'
              type='number'
              domain={['dataMin', 'dataMax']}
              tickFormatter = {(unixTime) => moment(unixTime).format(this.state.data.formatX)} />
          </LineChart>
          </ResponsiveContainer>
         
          <Button color={this.state.data.buttonC.today} variant="raised" onClick={this.today}  className={classes.button}>
              I dag
            </Button>
            <Button color={this.state.data.buttonC.seven} variant="raised" onClick={this.sevenDay} className={classes.button}>
              7 dager
            </Button>
            <Button color={this.state.data.buttonC.thirty} variant="raised"  onClick={this.thirtyDay} className={classes.button}>
              30 dager
            </Button>
          </Paper>
      </Grid>    
    </Grid>
     
    );
  }
}
SampleStats.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SampleStats);
