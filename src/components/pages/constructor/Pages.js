import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_nav_bar_data, change_page_data} from "../../../store/actions/homeAction";
import {update_images_data} from "../../../store/actions/imagesAction";
import {set_remove_images} from "../../../store/actions/removeImagesAction";
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Loader from "react-loader-spinner";
import {useToasts} from 'react-toast-notifications';
import FirebaseFunctions from "../../../Firebase/FirebaseFunctions";
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
        fontWeight: 600,
    },
    btnSave: {
        width: 300,
    },
    loader: {
        margin: '0 10px',
        '& figure > div': {
            verticalAlign: 'middle',
            display: 'inline-block',
        },
    },
}));

const initPages = [
    {name: 'home', navName: 'Home', title: 'home', state: false, url: ""},
    {name: 'posts', navName: 'Posts', title: 'posts', state: false, url: "posts"},
    {name: 'events', navName: 'Events', title: 'events', state: false, url: "events"},
    {name: 'aboutUs', navName: 'About us', title: 'about_us', state: false, url: "about"},
    {name: 'contactUs', navName: 'Contact us', title: 'contact_us', state: false, url: "contact-us"},
];

const initDefaultPages = [
    {name: 'home', navName: 'Home', url: ""},
    {name: 'posts', navName: 'Posts', url: "posts"},
    {name: 'events', navName: 'Events', url: "events"},
];

function Pages(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const {home, images, removeImages} = useSelector(state => state);
    const [pagesList, setPagesList] = useState([...initPages]);
    const [selectedPages, setSelectedPages] = useState([...initDefaultPages]);
    const [_loader, setLoader] = useState(false);
    const {lang} = props;

    useEffect(function () {
        getNavBardData();
    }, []);

    const getNavBardData = () => {
        FirebaseFunctions.getData("nav-bar")
            .then(response => {
                if (Object.keys(response).length > 0) {
                    const pages = [...response.pages];
                    setSelectedPages([...pages]);
                    const updatePageState = initPages.map(item => {
                        for (let i=0; i < pages.length; i++ ){
                            if(pages[i]?.name === item?.name){
                                return {...item, state: true};
                            }
                        }
                        return item;
                    });
                    setPagesList([...updatePageState]);
                    props.changeNavBarState({...response});
                }
            })
            .catch(error => {
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            });
    }

    const addRemovePage = (state, name) => {
        const tempState = [...pagesList];
        const tempPages = [];
        tempState.map(item => {
            if(item.name === name){
                item.state = !item.state;
            }
            if(item.state === true){
                tempPages.push({name: item.name, navName: item.navName, url: item.url})
            }
            return item;
        })
        setPagesList([...tempState]);
        setSelectedPages([...tempPages]);

        props.changeNavBarState({
                ...home.site.navBar,
                pages: [...tempPages],
            }
        );
    }

    const saveNavBarData = () => {
        setLoader(true);
        if(images.length > 0) {
            FirebaseFunctions.uploadMultiImage(images, "home")
                .then(response => {
                    setLoader(false);
                    if (response.length > 0) {
                        const navBar = {...home.site.navBar};
                        if (navBar.slider) {
                            navBar.slider = [...navBar.slider, ...response];
                        } else {
                            navBar.slider = [...response];
                        }
                        saveData({...navBar});
                        props.updateImagesData([]);
                        props.changeNavBarState({...navBar});
                    }
                })
                .catch(error => {
                    setLoader(false);
                    addToast(error.message, {
                        appearance: 'error',
                        autoDismiss: true,
                    });
                });
        }else{
            saveData({...home.site.navBar});
        }
        if(removeImages.length > 0){
            FirebaseFunctions.removeSelectedImages(removeImages, "home");
            props.setRemoveImages([]);
        }
    }

    const saveData = (data) => {
        FirebaseFunctions.updateData("nav-bar", {...data})
            .then(response => {
                setLoader(false);
                if(response.result){
                    addToast(lang.data_updated_successfully, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
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
                        <h2 className={`${classes.h2}`}>{lang.available_site_pages}:</h2>
                        <NavBar lang={lang} pagesList={pagesList} addRemovePage={addRemovePage}/>
                    </Paper>
                </Grid>
                {/* Selected page lists */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h2 className={`${classes.h2}`}>{lang.added_pages}:</h2>
                        <NavBarResult lang={lang} selectedPages={selectedPages}/>
                    </Paper>
                </Grid>
                {/* Advanced settings section */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h2 className={`${classes.h2}`}>{lang.advanced_settings}:</h2>
                        <hr/>
                        <SettingsSection lang={lang}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button variant="contained" color="primary" className={classes.btnSave} disabled={_loader} onClick={() => saveNavBarData()}>
                            {lang.save_all_changes}
                            {_loader ?
                                <figure className={classes.loader}>
                                    <Loader type="ThreeDots" color="#fff" height={15} width={40}/>
                                </figure> : null
                            }
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeHomeState: (data) => {dispatch(change_page_data(data))},
        changeNavBarState: (data) => {dispatch(change_nav_bar_data(data))},
        updateImagesData: (data) => {dispatch(update_images_data(data))},
        setRemoveImages: (data) => {dispatch(set_remove_images(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Pages)
