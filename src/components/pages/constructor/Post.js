import React, {useState} from 'react'
import SettingsSectionPost from "./postsComponents/SettingsSectionPost";
import PreviewSettings from "./postsComponents/PreviewSettings";
import {Grid, Paper} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {makeStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {notification} from "antd";
import Firebase from "../../../Firebase/Firebase";
import {change_page_data} from "../../../store/actions/homeAction";
import { v1 as uuidv1 } from 'uuid';

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
          {lang} = props;

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

    const youtubeParser = (url) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }

    const currentDate = () => {
        let today = new Date(),
            dd = String(today.getDate()).padStart(2, '0'),
            mm = String(today.getMonth() + 1).padStart(2, '0'),
            yyyy = today.getFullYear();

        return mm + '/' + dd + '/' + yyyy;
    }

    const handelSendAllChanges = (postData) => {
        let sendData = {id: uuidv1()};


            setIsLoadingBtnSave(true)
        pictureUpload(postData.sliderImage).then((imgUrls) => {
            pictureUpload(postData.postImage).then((imgUrl) => {
                pictureUpload(postData.postPhoto).then((photoUrl) => {
                    sendData.imgUrl = imgUrl.length > 0 ? imgUrl[0] : "";
                    sendData.category = postData.CATEGORY;
                    sendData.title = postData.TITLE;
                    sendData.dateCreated = currentDate();
                    sendData.components = {
                        SLIDE: {type: 'SLIDE', imgUrls},
                        PHOTO: {type: 'PHOTO', imgUrl: [...photoUrl]},
                        HEADING: {type: 'HEADING', text: postData.HEADING},
                        PARAGRAPH: {type: 'PARAGRAPH', text: postData.PARAGRAPH},
                        QUOTE: {type: 'QUOTE', text: postData.QUOTE},
                        VIDEO: {type: 'VIDEO', videoParam: youtubeParser(postData.VIDEO)}
                    };

                      Firebase.post(sendData.id).set(sendData, function (error) {
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
                        }
                        setIsLoadingBtnSave(false)
                    })
                })
                })
            })

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
                    {/* Preview Post*/}
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
                            <SettingsSectionPost isLoading={isLoadingBtnSave} sendData={handelSendAllChanges}
                                                 lang={lang}/>
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