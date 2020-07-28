import React, {useState} from 'react'
import SettingsSectionPost from "./postsComponents/SettingsSectionPost";
import PreviewSettings from "./postsComponents/PreviewSettings";
import {Button, Grid, Paper, CircularProgress} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {makeStyles} from '@material-ui/core/styles';
import {connect, useSelector} from "react-redux";
import {notification} from "antd";
import Firebase from "../../../Firebase/Firebase";
import {change_page_data} from "../../../store/actions/homeAction";

const initialDataPost = {
    slide: [],
    heading: "",
    photo: [],
    paragraph: "",
    videoUrl: "",
    quote: "",
    listPosts: {
        allList: [],
        loading: false,
        entry: {},
    }
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
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
    },
    btnSave: {
        width: 300,
    },
}));

function Post(props) {
    const [isLoadingBtnSave, setIsLoadingBtnSave] = useState(false),
        classes = useStyles(),
        {lang} = props,
        {home} = useSelector(state => state);

    const validationAdvancedSettings = (post) => {
        let isValid = true;

        for (let propPost in post) {
            if (propPost === "slide") {
                if (!post[propPost].length) {
                    isValid = false;
                    notification.warning({
                        message: lang.notification,
                        description: `Is a empty ${propPost}`,
                        placement: "topRight",
                    });
                }
            } else if (propPost === "heading" || propPost === "paragraph" || propPost === "videoUrl" || propPost === "quote") {
                if (!post[propPost].trim().length) {
                    isValid = false;
                    notification.warning({
                        message: lang.notification,
                        description: `Is a empty ${propPost}`,
                        placement: "topRight",
                    });
                }
            }
        }

        return isValid
    }

    const saveImageAsStorage = (pic) => {
        return new Promise((resolve, reject) => {
            Firebase.storage.ref("storage/images/posts").child(`${new Date().getTime()}`).put(pic.originFileObj).then((snap) => {
                snap.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            });
        })
    }

    const pictureUpload = (picData) => {
        let urls = picData.map((pic) => {
            return saveImageAsStorage(pic);
        })

        return Promise.all(urls)
    }

    const handelSendAllChanges = async (e) => {
        e.preventDefault()
        let {site} = home,
            sendData = {},
            post = {...site.post};

        if (validationAdvancedSettings(post)) {
            setIsLoadingBtnSave(true)
            pictureUpload(post.slide).then((imgUrls) => {
                pictureUpload(post.photo).then((imgUrl) => {
                    sendData.SLIDE = {type: 'SLIDE', imgUrls};
                    sendData.PHOTO = {type: 'PHOTO', imgUrl};
                    sendData.HEADING = {type: 'HEADING', text: post.heading};
                    sendData.PARAGRAPH = {type: 'PARAGRAPH', text: post.paragraph};
                    sendData.VIDEO = {type: 'VIDEO', text: post.videoUrl};
                    sendData.QUOTE = {type: 'QUOTE', text: post.quote};
                    sendData.created_at = {type: 'created_at', time: new Date().getTime()};
                    sendData.updated_at = {type: 'updated_at', time: new Date().getTime()};
                    Firebase.post(new Date().getTime()).set(sendData, function (error) {
                        if (error) {
                            notification.warning({
                                message: lang.notification,
                                description: lang.error_post_added,
                                placement: "topRight",
                            });
                        } else {
                            notification.success({
                                message: lang.notification,
                                description: lang.post_added,
                                placement: "topRight",
                            });
                            props.changeHomeState({
                                    ...home,
                                    site: {
                                        ...home.site,
                                        post: {...initialDataPost}
                                    }
                                }
                            );
                        }
                        setIsLoadingBtnSave(false)
                    })
                })
            })
        }
    }

    return (
        <div>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <h1 className={classes.h1}>{lang.site_post}</h1>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Alert severity="warning">{lang.info_posts}</Alert>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/* Preview Advanced settings */}
                    {
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <h2 className={`${classes.h1} ${classes.h2}`}>{lang.preview_advanced_settings}:</h2>
                                <hr/>
                                <PreviewSettings lang={lang}/>
                            </Paper>
                        </Grid>
                    }

                    {/* Advanced settings section */}
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h2 className={`${classes.h1} ${classes.h2}`}>{lang.advanced_settings}:</h2>
                            <hr/>
                            <SettingsSectionPost lang={lang}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {
                                isLoadingBtnSave ? <CircularProgress size={14}/> : home.currentSetting !== "listPosts" ?
                                    <Button onClick={handelSendAllChanges} variant="contained" color="primary"
                                            className={classes.btnSave}>
                                        {lang.save_all_changes}
                                    </Button> : null
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </div>
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
        changeHomeState: (data) => {
            dispatch(change_page_data(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)