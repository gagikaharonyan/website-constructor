import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import data from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 600,
        fontSize: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& span': {
          marginLeft: 5,
        },
    },
}));

export default function UnknownSection(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <iframe width="800" height="500" src={data.presentationYoutubeLink}
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen/>
                </Grid>
            </Grid>
        </div>
    );
}