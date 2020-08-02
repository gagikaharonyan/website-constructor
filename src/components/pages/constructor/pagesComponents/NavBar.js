import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Tabs, Tab, Tooltip} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
    },
    navItem: {
        '& span': {
            fontWeight: 600,
            color: 'white',
        },
    },
}));

export default function NavBar(props) {
    const classes = useStyles();
    const {lang, pagesList, addRemovePage} = props;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.center}>
                    <Typography variant="h6">
                        <Tabs value={0} aria-label="site main pages">
                            {pagesList.map(item => (
                                item.name === "aboutUs" || item.name === "contactUs" ?
                                    <Tooltip title={item.state ? lang.remove_minus : lang.add_plus}
                                             aria-label="add remove" placement="top"
                                             key={item.name} onClick={() => addRemovePage(item.state, item.name)}>
                                        <Tab label={lang[item.title]} className={classes.navItem}/>
                                    </Tooltip> :
                                    <Tab label={lang[item.title]} key={item.name} className={classes.navItem}/>
                            ))}
                        </Tabs>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}