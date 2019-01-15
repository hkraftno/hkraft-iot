import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Router, Link } from "react-router-dom";
import StartPage from './StartPage';
import StartPageClosed from './StartPageClosed';

import Temp from './Temp';
import Om from './Om';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';


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
import ShowChartIcon from '@material-ui/icons/ShowChart';
import HomeIcon from '@material-ui/icons/Home';

import './App.css';

const history = configureHistory();


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    fontFamily: ['Madera,sans-serif', 'cursive'],
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
  async componentDidMount() {
    console.log("App")
  }


  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Router history={history}>
        <MuiThemeProvider theme={AnnaTheme}>

          <div className="App">
          <div><img alt="Haugaland Kraft" src={logo} className="App-logo"/></div>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.flex}>Bade-Anna</Typography>
              </Toolbar>
            </AppBar>

            <Drawer open={this.state.open}
              containerStyle={{ height: 'calc(100% - 64px)', top: 64 }}>



            </Drawer>

            <Route exact path="/" component={StartPage} />
            <Route exact path="/closed" component={StartPageClosed} />
            <Route exact path="/stats" component={Temp} />
            <Route exact path="/om" component={Om} />
            <BottomNavigation
              value={value}
              onChange={this.handleChange}
              showLabels
              className={classes.menuButton}
            >
              <BottomNavigationAction component={Link} to="/" label="Forsiden" icon={<HomeIcon />} />
              <BottomNavigationAction component={Link} to="/stats" label="Over tid" icon={<ShowChartIcon />} />
              <BottomNavigationAction component={Link} to="/om" label="Om Bade-Anna" icon={<InfoIcon />} />

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
