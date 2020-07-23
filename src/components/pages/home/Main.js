import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Grid} from '@material-ui/core';
import NavBar from "../constructor/NavBar";
import Banner from "../constructor/Banner";
import Post from "../constructor/Post";
import Quote from "../constructor/Quote";
import Video from "../constructor/Video";
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
    const {activeAction} = props

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={`${classes.container}`}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={9}>
                        {/* constructor work section */}
                        {(() => {
                            switch (activeAction) {
                                case "nav-bar":
                                    return <NavBar />
                                case "banner":
                                    return <Banner />
                                case "post":
                                    return <Post />
                                case "quote":
                                    return <Quote />
                                case "video":
                                    return <Video />
                                default: return <UnknownSection/>
                            }
                        })()}
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}