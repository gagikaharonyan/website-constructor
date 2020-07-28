import React from "react";
import {useToasts} from 'react-toast-notifications';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, Paper, Button} from "@material-ui/core";
import {CalendarToday, DeleteForeverOutlined, EditOutlined} from '@material-ui/icons';
import FirebaseFunctions from "../../../../Firebase/FirebaseFunctions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& span': {
            marginLeft: 5,
        },
    },
    h1: {
        color: '#000',
        fontSize: 30,
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
    },
    emptyEvent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: '#eca407',
        fontWeight: 600,
        '& svg': {
            fontSize: 27,
            marginBottom: 5,
            color: '#9b6619',
        },
    },
    title: {
        textAlign: 'left',
        marginLeft: 25,
        fontSize: 18,
        borderBottom: '1px solid #9a9a9a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        '& img': {
            width: 250,
            height: 'auto',
        },
    },
    hr: {
        width: '50%',
        marginLeft: 4,
    },
    content: {
        textAlign: 'left',
    },
    subTitle: {
        fontSize: 15,
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function EventsList(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const {lang, events, updateEventsList, editEvent} = props;

    const deleteEvent = (id) => {
        FirebaseFunctions.deleteEventById(id, events[id].imageName)
            .then(response => {
                if(response.result){
                    addToast(lang.event_deleted_successfully, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
                    updateEventsList();
                }
            })
            .catch(error => {
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
        addToast(lang.event_deleted_successfully, {
            appearance: 'success',
            autoDismiss: true,
        });
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2 className={`${classes.h1}`}>{lang.all_events}</h2>
                    </Grid>
                    {Object.keys(events).length > 0 ?
                        Object.keys(events).map(item => (
                            <Grid item xs={12} key={item}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} className={`${classes.h1} ${classes.title}`}>
                                        <span>{events[item].title}</span>
                                        <span className={classes.buttons}>
                                            <Button variant="outlined" color="primary" onClick={() => editEvent(item)}>
                                                <EditOutlined /> {lang.edit}
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => deleteEvent(item)}>
                                                <DeleteForeverOutlined /> {lang.delete}
                                            </Button>
                                        </span>
                                    </Grid>
                                    <Grid item xs={4} className={classes.image}>
                                        <figure>
                                            <img src={events[item].imageUrl ? events[item].imageUrl : '/images/upcoming-event.jpg'} alt="event"/>
                                        </figure>
                                    </Grid>
                                    <Grid item xs={8} className={classes.content}>
                                        <div>
                                            <span className={`${classes.h1} ${classes.subTitle}`}>
                                                {lang.details}:
                                            </span><br/>
                                            <div dangerouslySetInnerHTML={{ __html: events[item].details }} />
                                        </div>
                                        <hr className={classes.hr}/>
                                        <div>
                                            <span className={`${classes.h1} ${classes.subTitle}`}>
                                                {lang.date}:&nbsp;
                                            </span>
                                            {events[item].date}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))
                        :
                        <Grid item xs={12}>
                            <div className={classes.emptyEvent}>
                               <CalendarToday /> <span>{lang.event_list_empty}</span>
                            </div>
                        </Grid>
                    }
                </Grid>
            </Paper>
        </div>
    );
}

export default EventsList;