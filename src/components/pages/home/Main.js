import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Grid} from '@material-ui/core';
import Pages from "../constructor/Pages";
import Events from "../constructor/Events";
import Post from "../constructor/Post";
import ContactUs from "../constructor/ContactUs";
import UnknownSection from "../constructor/UnknownSection";

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export default function Main(props) {
    const classes = useStyles();
    const {lang, activeAction} = props

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={`${classes.container}`}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {/* constructor work section */}
                        {(() => {
                            switch (activeAction) {
                                case "nav-bar":
                                    return <Pages lang={lang}/>
                                case "events":
                                    return <Events lang={lang}/>
                                case "post":
                                    return <Post lang={lang}/>
                                case "contactUs":
                                    return <ContactUs lang={lang}/>
                                default: return <UnknownSection lang={lang}/>
                            }
                        })()}
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}