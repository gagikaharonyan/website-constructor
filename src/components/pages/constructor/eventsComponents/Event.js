import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_events_state, change_page_data} from "../../../../store/actions/homeAction";
import {set_image, update_images_data} from "../../../../store/actions/imagesAction";
import {remove_image, set_remove_images} from "../../../../store/actions/removeImagesAction";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {useToasts} from 'react-toast-notifications';
import {makeStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Loader from 'react-loader-spinner';
import {Paper, Grid, TextField, Button} from '@material-ui/core';
import {Clear, InsertPhotoOutlined, PanoramaOutlined, PermMedia, Save} from '@material-ui/icons';
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
    h4: {
        display: "flex",
        fontSize: 17,
    },
    imageContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
    selectedImage: {
        display: 'inline',
        '& div': {
            display: 'inline-block',
        },
    },
    selectedFile: {
        display: 'inline',
        '& img': {
            width: 150,
        },
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
        '& figure': {
            margin: '0 10px',
            '& > div': {
                display: 'flex',
            },
        },
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '235px!important',
    },
    delItem: {
        position: "relative",
        marginLeft: 30,
        '& span svg': {
            position: 'absolute',
            fontSize: 15,
            color: 'black',
        },
        '& span:hover svg': {
            color: 'red',
            cursor: 'pointer',
        },
        '& figure': {
            marginRight: 10,
        },
    },
    warning: {
        textShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: 12,
        marginLeft: 10,
        color: '#f38207',
        '& svg': {
            fontSize: 17,
            marginRight: 3,
        },
    },
}));

const initEvent = {
    id: '',
    title: '',
    images: [],
    details: '',
    date: '',
    location: '',
};

const initImageData = {
    selectedFile: null,
    file: null,
    name: null,
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

const addZero = i => i < 10 ? `0${i}` : i;

const convertDate = (data) => {
    /* Format to /yyyy-mm-dd T hh:mm/ */
    let d = data ? new Date(data) : new Date();
    const year = d.getFullYear();
    const date = addZero(d.getDate());
    const month = addZero(d.getMonth() + 1);
    const hours = addZero(d.getHours());
    const minutes = addZero(d.getMinutes());
    return `${year}-${month}-${date}T${hours}:${minutes}`;
}

const getDate = (data) => {
    /* Format to /day month year at hours:minutes/ */
    let d = data ? new Date(data) : new Date();
    const year = d.getFullYear();
    const date = addZero(d.getDate());
    const monthIndex = d.getMonth();
    const monthName = months[monthIndex];
    const hours = addZero(d.getHours());
    const minutes = addZero(d.getMinutes());
    return `${date} ${monthName} ${year} at ${hours}:${minutes}`;
}

function Event(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const {home, images, removeImages} = useSelector(state => state);
    const [newEvent, setNewEvent] = useState({...initEvent});
    const [imageData, setImageData] = useState({...initImageData});
    const [noValid, setNoValid] = useState(initValidation);
    const [_loader, setLoader] = useState(false);
    const [selectedDate, setSelectedDate] = useState(convertDate(new Date()));
    const {lang, editEventData} = props;

    useEffect(function () {
        if (Object.keys(editEventData).length > 0 && editEventData.id) {
            setNewEvent({...editEventData});
            setImageData({...initImageData});
            setSelectedDate(convertDate(editEventData.cleanDate));
        }
        if(home.currentSetting === "newEvent"){
            setNewEvent({...initEvent});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleChangeDate = (ev) => {
        let value = ev.target.value;
        const formatted = getDate(value);
        setSelectedDate(value);
        setNewEvent(prevState => {
            return {...prevState, date: formatted};
        });
        setNoValid({error: false});
    }

    const setImage = (e) => {
        let file = e.target.files[0]
        const reader = new FileReader()
        if(file !== undefined &&
            (file.type === "image/jpeg" || file.type === "image/png" ||
                file.type === "image/jpg" || file.type === "image/gif")){
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setImageData(() => {
                    return {
                        selectedFile: reader.result,
                        name: file.name,
                        file
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

    const addImage = () => {
        if(imageData.file){
            let name = `${Date.now()}_${imageData.name}`;
            const addData = {...imageData, name};
            props.setNewImage(addData);
            setImageData({...initImageData});
        }else {
            addToast(lang.error_empty_image, {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    }

    const deleteImage = (name) => {
        const imagesData = [...newEvent.images];
        const deleteImage = imagesData.filter(item => item.name !== name);
        props.removeImage({name: name});
        setNewEvent({...newEvent, images: [...deleteImage]});
    }

    const deleteImageFromStore = (name) => {
        const imagesData = [...images];
        const deleteImage = imagesData.filter(item => item.name !== name);
        props.updateImagesData([...deleteImage]);
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
                images: [...newEvent.images],
                details: newEvent.details,
                location: newEvent.location,
                cleanDate: selectedDate,
                date: newEvent.date === "" ? getDate() : newEvent.date,
            };
            setLoader(true);
            if(images.length > 0) {
                FirebaseFunctions.uploadMultiImage(images, "events")
                    .then(response => {
                        setLoader(false);
                        if (response.length > 0) {
                            if (newEventData.images && newEventData.images.length > 0) {
                                newEventData.images = [...newEventData.images, ...response];
                            } else {
                                newEventData.images = [...response];
                            }
                            props.updateImagesData([]);
                            update ? updateEvent(newEventData, id) : saveEvent(newEventData, id);
                        }
                    })
                    .catch(error => {
                        setLoader(false);
                        addToast(error.message, {
                            appearance: 'error',
                            autoDismiss: true,
                        });
                    });
            }else {
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
                    props.changeEventsState({...tempEvents});
                    setNewEvent({...initEvent});
                    setSelectedDate(convertDate(new Date()));
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
        FirebaseFunctions.updateDataById("events", id, {...data})
            .then(response => {
                setLoader(false);
                if(response.result){
                    addToast(lang.event_successfully_updated, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
                    const tempEvents = Object.assign({}, {...home.site.events, [id]: {...data}});
                    props.changeEventsState({...tempEvents});
                    setNewEvent({...data});
                }
            })
            .catch(error => {
                setLoader(false);
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
        if(removeImages.length > 0){
            FirebaseFunctions.removeSelectedImages(removeImages, "events");
            props.setRemoveImages([]);
        }
    }

    const storeImagesJSX = images.length > 0 ? images.map(item => (
            <div className={`${classes.selectedImage} ${classes.delItem}`}
                 key={item.name}>
                <figure className={classes.selectedFile}>
                    <img src={item.selectedFile} alt="slide"/>
                </figure>
                <span onClick={() => deleteImageFromStore(item.name)}>
                    <Clear/>
                </span>
            </div>
        )) : null;

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
                                    <TextField
                                        required
                                        name={"location"}
                                        label={lang.location_}
                                        variant="outlined"
                                        value={newEvent.location}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                    <TextField
                                        id="datetime-local"
                                        label={lang.date}
                                        type="datetime-local"
                                        value={selectedDate}
                                        className={classes.textField}
                                        name={"date"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(ev) => handleChangeDate(ev)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid item sm={12} md={6} className={classes.imageContent}>
                                            <Button variant="outlined" component="label" className={classes.fileBtn}>
                                                <PanoramaOutlined htmlColor={"#797979"}/>&nbsp;
                                                {lang.select_image}
                                                <input
                                                    type="file"
                                                    name={"techImg"}
                                                    className={classes.fileInput}
                                                    onChange={(e)=>setImage(e)}
                                                />
                                            </Button>
                                            <Button variant="contained" color="primary" type={"button"} className={`${classes.btn} ${classes.loader}`}
                                                disabled={_loader || !imageData.selectedFile} onClick={()=>addImage()}>
                                                <InsertPhotoOutlined /> {lang.add}
                                                {_loader ?
                                                    <figure>
                                                        <Loader type="ThreeDots" color="#fff" height={15} width={40}/>
                                                    </figure> : null
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item sm={12} md={6}>
                                            {imageData.selectedFile ?
                                                <div className={classes.selectedImage}>
                                                    <figure className={classes.selectedFile}>
                                                        <img src={imageData.selectedFile} alt="slide"/>
                                                    </figure>
                                                </div>
                                                :
                                                null
                                            }
                                        </Grid>
                                    </Grid>
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
                                { newEvent.images.length > 0 ?
                                    <Grid item xs={12}>
                                        <h4 className={`${classes.h1} ${classes.h4}`}>
                                            <PermMedia />&nbsp;{lang.images}
                                        </h4>
                                        <hr/>
                                        <div>
                                            {newEvent.images.map(item => (
                                                <div className={`${classes.selectedImage} ${classes.delItem}`}
                                                     key={item.name}>
                                                    <figure className={classes.selectedFile}>
                                                        <img src={item.url} alt="slide"/>
                                                    </figure>
                                                    <span onClick={() => deleteImage(item.name)}>
                                                        <Clear/>
                                                    </span>
                                                </div>
                                            ))
                                            }
                                            {images.length > 0 && storeImagesJSX}
                                        </div>
                                    </Grid> :
                                        images.length > 0 ?
                                            <Grid item xs={12}>
                                                <h4 className={`${classes.h1} ${classes.h4}`}>
                                                    <PermMedia />&nbsp;{lang.images}
                                                </h4>
                                                <hr/>
                                                <div>
                                                    {storeImagesJSX}
                                                </div>
                                            </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <div className={classes.image}>
                                                <figure className={"selected-file"}>
                                                    <img src={"/images/upcoming-event.jpg"} alt="event"/>
                                                </figure>
                                            </div>
                                        </Grid>
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
                                    <Button variant="contained" color="primary" type={"submit"} disabled={_loader} className={classes.loader}>
                                        <Save />&nbsp;
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
        changeEventsState: (data) => {dispatch(change_events_state(data))},
        setNewImage: (data) => {dispatch(set_image(data))},
        updateImagesData: (data) => {dispatch(update_images_data(data))},
        setRemoveImages: (data) => {dispatch(set_remove_images(data))},
        removeImage: (data) => {dispatch(remove_image(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Event);