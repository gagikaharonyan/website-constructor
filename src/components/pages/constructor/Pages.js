import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import NavBar from "./pagesComponents/NavBar";
import NavBarResult from "./pagesComponents/NavBarResult";
import SettingsSection from "./pagesComponents/SettingsSection";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    alert: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    h1: {
        color: '#000',
        fontSize: 30,
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
    },
    h2: {
        fontSize: 20,
        textAlign: 'left',
    },
    btnSave: {
        width: 300,
    },
}));

const initPages = [
    {name: 'home', title: 'home', state: false},
    {name: 'posts', title: 'posts', state: false},
    {name: 'events', title: 'events', state: false},
    {name: 'aboutUs', title: 'about_us', state: false},
    {name: 'contactUs', title: 'contact_us', state: false},
];

const initDefaultPages = [
    {name: 'home', title: 'home', state: false},
    {name: 'posts', title: 'posts', state: false},
    {name: 'events', title: 'events', state: false},
];

export default function Pages(props) {
    const classes = useStyles();
    const [pagesList, setPagesList] = useState([...initPages]);
    const [selectedPages, setSelectedPages] = useState([...initDefaultPages]);
    const {lang} = props;

    const addRemovePage = (state, name) => {
        const tempState = [...pagesList];
        const tempPages = [...initDefaultPages];
        tempState.map(item => {
            if(item.name === name){
                item.state = !item.state;

            }
            if(item.state === true){
                tempPages.push({name: item.title})
            }
            return item;
        })
        setPagesList([...tempState]);
        setSelectedPages([...tempPages]);
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h1 className={classes.h1}>{lang.site_pages}</h1>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Alert severity="warning">{lang.info_pages}</Alert>
                        </Grid>
                    </Paper>
                </Grid>
                {/* Default page lists  */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h2 className={`${classes.h1} ${classes.h2}`}>{lang.available_site_pages}:</h2>
                        <NavBar lang={lang} pagesList={pagesList} addRemovePage={addRemovePage}/>
                    </Paper>
                </Grid>
                {/* Selected page lists */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h2 className={`${classes.h1} ${classes.h2}`}>{lang.added_pages}:</h2>
                        <NavBarResult lang={lang} selectedPages={selectedPages}/>
                    </Paper>
                </Grid>
                {/* Advanced settings section */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h2 className={`${classes.h1} ${classes.h2}`}>{lang.advanced_settings}:</h2>
                        <hr/>
                        <SettingsSection lang={lang}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button variant="contained" color="primary" className={classes.btnSave}>
                            {lang.save_all_changes}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
