import React from 'react';
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Tab, Tabs} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            fontWeight: 600,
        },
    },
}));

export default function NavBarResult(props) {
    const classes = useStyles();
    const {home} = useSelector(state => state);
    const {lang, selectedPages} = props;
    const navBarStyle = {};
    const navBarFont = {};

    if(home.site.navBar.backgroundColor !== ""){
        navBarStyle.backgroundColor = home.site.navBar.backgroundColor;
    }

    if(home.site.navBar.color !== ""){
        navBarStyle.color = home.site.navBar.color;
    }

    if(home.site.navBar.fontFamily !== ""){
        navBarFont.fontFamily = home.site.navBar.fontFamily;
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.center} style={navBarStyle}>
                    {selectedPages.length > 0 ?
                        <Tabs value={0} aria-label="site main pages">
                            {selectedPages.map(item => (
                                <Tab label={lang[item.name]} key={item.name} style={navBarFont}/>
                            ))}
                        </Tabs>
                        :
                        <Typography variant="h6" className={classes.title}>
                            <span>{lang.empty_page_list}</span>
                        </Typography>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}