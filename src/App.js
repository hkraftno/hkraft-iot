import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Router, Link } from "react-router-dom";
import BadetemperaturPage from './BadetemperaturPage';
import SensorPage from './SensorPage';
import Om from './Om';
import AppBar from '@material-ui/core/AppBar';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import configureHistory from './configureHistory';
import AnnaTheme from './AnnaTheme';
import logo from './logo.svg'

import InfoIcon from '@material-ui/icons/Info';
import PoolIcon from '@material-ui/icons/Pool';
import SensorIcon from '@material-ui/icons/SettingsInputAntenna';

import './App.css';

const history = configureHistory();


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    fontFamily: ['Madera,sans-serif'],
    fontSize: '25pt',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,

    position: "fixed",
    bottom: "0",
    width: "100%",
  },
};

class App extends Component {
  state = {
    open: false,
    value: 0
  };


  handleToggle = () => this.setState({ open: !this.state.open });
  handleChange = (event, value) => this.setState({ value });
  async componentDidMount() {}

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Router history={history}>
        <MuiThemeProvider theme={AnnaTheme}>

          <div className="App">
          {/* <div><img alt="Haugaland Kraft" src={logo} className="App-logo"/></div> */}
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.flex}>Haugaland Kraft IoT</Typography>
              </Toolbar>
            </AppBar>

            <Route exact path="/badetemperaturer" component={BadetemperaturPage} />
            <Route exact path="/sensorer" component={SensorPage} />
            <Route exact path="/" component={Om} />
            <BottomNavigation
              value={value}
              onChange={this.handleChange}
              showLabels
              className={classes.menuButton}
            >
              <BottomNavigationAction component={Link} to="/" label="Om HK IoT" icon={<InfoIcon />} />
              <BottomNavigationAction component={Link} to="/badetemperaturer" label="Badetemperaturer" icon={<PoolIcon />} />
              <BottomNavigationAction component={Link} to="/sensorer" label="Sensorer" icon={<SensorIcon />} />
            </BottomNavigation>
          </div>
        </MuiThemeProvider>
      </Router>
    );

  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
