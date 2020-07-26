import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_page_data} from "../../../../store/actions/homeAction";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {useToasts} from 'react-toast-notifications';
import {makeStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import Loader from 'react-loader-spinner';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {Paper, Grid, TextField, Button} from '@material-ui/core';
import {PanoramaOutlined} from '@material-ui/icons';
import FirebaseFunctions from '../../../../Firebase/FirebaseFunctions';
import { v1 as uuidv1 } from 'uuid';

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
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    h1: {
        color: '#000',
        fontSize: 30,
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
    },
    fileBtn: {
        height: '56px',
        width: '25ch',
        color: '#757575',
        fontSize: 15,
        margin: 8,
        '&:hover': {
            backgroundColor: 'white',
            borderColor: 'black'
        }
    },
    fileInput: {
        display: 'none'
    },
    image: {
        '& img': {
            height: 255,
        },
    },
    editorContainer: {
        display: "flex",
        justifyContent: "center",
    },
    editorContent: {
        '& h3': {
            color: '#000',
            fontSize: 18,
            textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
        },
    },
    loader: {
        margin: '0 10px',
        '& figure > div': {
            verticalAlign: 'middle',
            display: 'inline-block',
        },
    }
}));

const initEvent = {
    id: '',
    title: '',
    imageUrl: '',
    imageName: '',
    imageData: {
        selectedFile: null,
        file: null,
        name: null,
    },
    details: '',
    date: '',
};

const initValidation = {
    error: false,
};

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

function Event(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const {home} = useSelector(state => state);
    const [newEvent, setNewEvent] = useState({...initEvent});
    const [noValid, setNoValid] = useState(initValidation);
    const [_loader, setLoader] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const {lang, editEventData} = props;

    useEffect(function () {
        if (Object.keys(editEventData).length > 0 && editEventData.id) {
            setNewEvent({
                ...editEventData,
                imageData: {
                    selectedFile: null,
                    file: null,
                    name: null,
                }
            });
            setSelectedDate(new Date(editEventData.date));
        }
        if(home.currentSetting === "newEvent"){
            setNewEvent({...initEvent});
        }
    },[editEventData]);

    const handleChange = (ev) => {
        ev.preventDefault();
        let value = ev.target.value;
        let name = ev.target.name;
        setNewEvent(prevState=>{
            return {...prevState, [name]: value}
        });
        setNoValid({error: false});
    }

    const handleChangeDate = (data) => {
        const formatted = getDate(data);
        setSelectedDate(data);
        setNewEvent(prevState => {
            return {...prevState, date: formatted};
        });
        setNoValid({error: false});
    }

    const getDate = (data) => {
        let d = data ? new Date(data) : new Date();
        const year = d.getFullYear();
        const date = d.getDate();
        const monthIndex = d.getMonth();
        const monthName = months[monthIndex];
        return `${date} ${monthName} ${year}`;
    }

    const setImage = (e) => {
        let file = e.target.files[0]
        const reader = new FileReader()
        if(file !== undefined &&
            (file.type === "image/jpeg" || file.type === "image/png" ||
                file.type === "image/jpg" || file.type === "image/gif")){
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setNewEvent(newEvent => {
                    return {
                        ...newEvent, imageData: {
                            selectedFile: reader.result,
                            name: file.name,
                            file
                        },
                    }
                });
            }
        }else if(file !== undefined){
            addToast(lang.image_warning, {
                appearance: 'warning',
                autoDismiss: true
            });
        }
    }

    const handleChangeDetails = (event, editor) => {
        const data = editor.getData();
        setNewEvent(newEvent => {
            return {
                ...newEvent, details: data,
            }
        });
        setNoValid({error: false});
    }

    const saveEventData = (ev) => {
        ev.preventDefault();
        if(newEvent.title === "" || newEvent.details === ""){
            setNoValid({error: true});
        }else{
            let update = !!newEvent.id;
            let id = newEvent.id !== "" ? newEvent.id : uuidv1();
            const newEventData = {
                id: id,
                title: newEvent.title,
                imageUrl: newEvent.imageUrl,
                imageName: newEvent.imageName,
                details: newEvent.details,
                date: newEvent.date === "" ? getDate() : newEvent.date,
            };

            if(newEvent.imageData.file){
                setLoader(true);
                let name = `${Date.now()}_${newEvent.imageData.name}`;
                FirebaseFunctions.uploadImage({...newEvent.imageData, name}, 'events', newEvent.imageName)
                    .then(response => {
                        if (response.downloadURL !== "") {
                            newEventData.imageUrl = response.downloadURL;
                            newEventData.imageName = name;
                            update ? updateEvent(newEventData, id) : saveEvent(newEventData, id);
                        }
                    })
                    .catch(error => {
                        setLoader(false);
                        addToast(error.message, {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    });
            }else {
                setLoader(true);
                update ? updateEvent(newEventData, id) : saveEvent(newEventData, id);
            }
        }
    }

    const saveEvent = (data, id) => {
        FirebaseFunctions.addNewData("events", id, {...data, id})
            .then(response => {
                setLoader(false);
                if(response.result){
                    addToast(lang.event_successfully_added, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
                    const tempEvents = Object.assign({}, {...home.site.events, [id]: {...data}});
                    props.changeHomeState({
                        ...home, site: {...home.site, events: {...tempEvents}}}
                    );
                    setNewEvent({...initEvent});
                    setSelectedDate(new Date());
                }
            })
            .catch(error => {
                setLoader(false);
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
    }

    const updateEvent = (data, id) => {
        FirebaseFunctions.updateData("events", id, {...data})
            .then(response => {
                setLoader(false);
                if(response.result){
                    addToast(lang.event_successfully_updated, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
                    const tempEvents = Object.assign({}, {...home.site.events, [id]: {...data}});
                    props.changeHomeState({
                        ...home, site: {...home.site, events: {...tempEvents}}}
                    );
                }
            })
            .catch(error => {
                setLoader(false);
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2 className={`${classes.h1}`}>{lang.event}</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.form} autoComplete="off" onSubmit={(ev) => saveEventData(ev)}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name={"title"}
                                        label={lang.title}
                                        variant="outlined"
                                        value={newEvent.title}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                    <Button variant="outlined" component="label" className={classes.fileBtn}>
                                        <PanoramaOutlined htmlColor={"#797979"}/>&nbsp;
                                        {lang.select_image}
                                        <input
                                            type="file"
                                            name={"eventImg"}
                                            className={classes.fileInput}
                                            onChange={(e) => setImage(e)}
                                        />
                                    </Button>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            required
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label={lang.date}
                                            format="MM/dd/yyyy"
                                            name={"date"}
                                            value={selectedDate}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            onChange={(ev) => handleChangeDate(ev)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} className={classes.editorContainer}>
                                        <Grid item xs={8}>
                                            <div className={classes.editorContent}>
                                                <h3>{lang.details}</h3>
                                                <CKEditor
                                                    onInit={ editor => {
                                                        if(newEvent.details !== ""){
                                                            editor.setData(newEvent.details);
                                                        }
                                                    }}
                                                    data={newEvent.details}
                                                    editor={ClassicEditor}
                                                    onChange={(event, editor) => handleChangeDetails(event, editor)}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {newEvent.imageData.selectedFile ?
                                    <Grid item xs={12}>
                                        <div className={classes.image}>
                                            <figure className={"selected-file"}>
                                                <img src={newEvent.imageData.selectedFile} alt="event"/>
                                            </figure>
                                        </div>
                                    </Grid>
                                    :
                                    newEvent.imageUrl !== "" ?
                                        <Grid item xs={12}>
                                            <div className={classes.image}>
                                                <figure className={"selected-file"}>
                                                    <img src={newEvent.imageUrl} alt="event"/>
                                                </figure>
                                            </div>
                                        </Grid> : null
                                }
                                {noValid.error ?
                                    <Grid item xs={12}>
                                        <Alert variant="filled" severity="error">
                                            {lang.error_event_required_fields}
                                        </Alert>
                                    </Grid>
                                    : null
                                }
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type={"submit"} disabled={_loader}>
                                        {newEvent.id ? lang.update : lang.save}
                                        {_loader ?
                                            <figure className={classes.loader}>
                                                <Loader type="ThreeDots" color="#fff" height={15} width={40}/>
                                            </figure> : null
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeHomeState: (data) => {dispatch(change_page_data(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Event);