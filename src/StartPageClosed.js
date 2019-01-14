import React from 'react';

import SampleCard from './SampleClosedCard';

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


function StartPage(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
        <Grid container justify="center" spacing={8}  className={classes.root} alignItems="stretch"  >
            <Grid item xs={12}>
            <Typography variant="h4" >
                  Eivindsvatnet
            </Typography>
            <Typography variant="caption" >
                  Bade-Anna gjør jobben med å finne ut hvor varmt det er i vannet. Du må selv ta ansvar for å dyppe hodet.
            </Typography>
            </Grid>
            <Grid item xs={11} sm={5} md={4} >
                
                <SampleCard />
            </Grid>

        </Grid>
      </div>
    );

  }

  StartPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(StartPage);
