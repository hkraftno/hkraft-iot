import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {api } from './fire';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import WeatherSymbol from './WeatherSymbol'
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactGA from 'react-ga';

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
    test:{
      marginBottom:0,
      fontSize: '6rem',
    },
    control: {
      padding: theme.spacing.unit * 2,
    },
  });
  

class WeatherCard extends Component {
    state = { data: null };
    async componentDidMount() {
        //
        const result = await api.collection('weather').orderBy("lastupdate", "desc").limit(1).get();
        console.log(result);
        var data = result.docs[0].data();
        console.log("værdata ",data);
        this.setState({
          data: data,
        });
      }
  render() {
    const { classes } = this.props;

    if (!this.state.data ) { return (<CircularProgress className={classes.progress} size={50} />) }   
    return (

      <Paper  elevation={4} className={classes.paper} >
      <Grid container alignItems="center" justify="center" >
      <Grid item xs={12}>
                <Typography variant="h4" >
                  Været
                </Typography>
        </Grid>
        <Grid item  >
        <WeatherSymbol description={this.state.data.symbol.name} symbol={this.state.data.symbol.number}/>
        </Grid>
        <Grid item >
                <Typography variant="h1" className={classes.test} gutterBottom>
                &nbsp;{this.state.data.temperature}°
                </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
        
                <Typography variant="caption" align="center">
                Værvarsel fra <ReactGA.OutboundLink 
                eventLabel="YR"
                to={this.state.data.link}
              target="_blank">Yr levert av Meteorologisk institutt og NRK</ReactGA.OutboundLink>.<br/> Gjelder fra {this.state.data.time.from.toDate().toLocaleTimeString()} til {this.state.data.time.to.toDate().toLocaleTimeString()}
                </Typography>
        </Grid>       
      </Grid>       
    </Paper>
      
  
    );

  }
}
WeatherCard.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(WeatherCard);
