import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import ReactGA from 'react-ga';
import { Facebook } from 'mdi-material-ui';

const styles = theme => ({
    root: {
      flexGrow: 1,
      paddingBottom:'100px',
    },
    demo: {
      height: 240,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      maxWidth: '600px',
      margin:'auto',
      marginTop: '8px',
      
    },
    test:{
      marginBottom:0,
    },
    control: {
      padding: theme.spacing.unit * 2,
    },
  });
  

class Om extends Component {
    
  render() {
    const { classes } = this.props;

   
    return (
      <Grid container justify="center" spacing={8}  className={classes.root} alignItems="stretch"  >
        <Grid item xs={11} >
          <Paper  elevation={4} className={classes.paper} >
                <Typography variant="h4" gutterBottom align="center">
                Om Bade-Anna
                </Typography>
                <Typography variant="title" align="left" gutterBottom>
                Historien
                </Typography>      
                <Typography align="left" gutterBottom>
                Bade-Anna er ute og bader hele sommeren. Hun måler temperaturen i vannet og deler det med andre bade-entusiaster. Ikke alle er like glade i å bade i all slags vær som Bade-Anna, men det er bra at hun gjør det for oss. Da vet vi om temperaturen er akkurat passe når vi vil ta oss en dukkert. Bade-Anna melder også været. Eller, det vil si hun sjekker værmeldingen hos Yr.
                </Typography>
                <Typography variant="title" align="left" gutterBottom>
                Om tjenesten
                </Typography>      
                <Typography align="left" gutterBottom>
                Bade-Anna er laget som en prototype på hva som er mulig å få til med IoT. Fremover vil Haugaland Kraft lage flere nyttige tjenester som baserer seg på sensorer.
                <br/> <br/>
                Bade-Anna er en liten sensor (LoRa) med en temperaturmåler som flyter ute på Eivindsvatnet.  
                </Typography>
                <Typography variant="title" align="left" gutterBottom>
                Kontakt
                </Typography>      
                <Typography align="left" gutterBottom>
                Ta kontakt på <ReactGA.OutboundLink 
                eventLabel="facebook"
                to="https://www.facebook.com/HaugalandKraft/"
              target="_blank">facebook</ReactGA.OutboundLink> eller via tilbakemeldingsknappen på siden her, hvis det er noe du lurer på, er inspirert til å lage noe lignende selv eller bare vil gi en tilbakemelding
                </Typography>
                <Typography variant="title" align="left" gutterBottom>
                Om bruk av informasjonskapsler
                </Typography>      
                <Typography align="left" gutterBottom>
                Bade-Anna bruker informasjonskapsler fra Google Analytics, Hotjar.com og Facebook for å analysere bruken av tjenesten Bade-Anna. Disse tjenestene samler inn typisk informasjon som nettlesern du bruker, hvilke sider du har besøk, hvor du kom fra, hva slags enhet du bruker og hvor lenge du har vært på siden.<br/> <br/>
                Dette gjør vi for å kunne lage siden bedre og lære litt opp hvordan man kan få trafikk inn på siden. <br/> <br/>
                Ønsker du at disse kapselene ikke skal benyttes kan du fjerne de under instilllinger i nettleseren din. Der kan du også skru av bruk av slike inforemasjonskapsler helt.  Mener du at jeg burde lage funksjonalitet for å gjøre dette på en enklere måte, så ta kontakt på facebook eller opp i tilbakemeldingsknappen. Det er interessant om å høre om du synes dette ikke er greit. Ellers håper jeg du er fornøyd med tjenesten og fortsetter å benytte den selv om jeg måler litt om hvordan den brukes. 
                </Typography>

              <ReactGA.OutboundLink 
                eventLabel="facebook"
                to="https://www.facebook.com/HaugalandKraft"
              target="_blank"><Facebook /></ReactGA.OutboundLink> 
          </Paper>
        </Grid>    
      </Grid>
  
    );

  }
}
Om.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Om);
