import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid} from '@material-ui/core';
import {CheckBoxOutlineBlank} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 300,
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
    const {lang} =props;

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}><CheckBoxOutlineBlank /> <span>{lang.select_section_to_edit}</span></Paper>
                </Grid>
            </Grid>
        </div>
    );
}