import React, {useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import AboutUsSettings from "./aboutUsComponents/aboutUsSettings";
import {
    change_page_data,
    changedCategory,
    fetchAboutUs,
} from "../../../store/actions/homeAction";
import {connect, useSelector} from "react-redux";
import FirebaseFunctions from "../../../Firebase/FirebaseFunctions";
import {notification, Spin} from "antd";

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

function AboutUs(props) {
    const classes = useStyles(),
        {lang} = props,
        {home} = useSelector(state => state),
        {site: {aboutUs: {isLoading, data}}} = home;

    useEffect(() => {
        props.getAboutUsData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendData = (fields) => {
        let name = new Date().getTime(),
            id = data.id,
            sendData = {id};
        sendData.title = fields.title;
        sendData.description = fields.description;
        sendData.avatar = fields.avatar[0].url
        if (fields.avatar[0].originFileObj === undefined) {
            return props.changeAboutUs(sendData)
        }

        FirebaseFunctions.uploadImage({file: fields.avatar[0].originFileObj, name}, 'aboutUs', "")
            .then(response => {
                console.log(response)
                if (response.downloadURL !== "") {
                    sendData.avatar = response.downloadURL;
                    props.changeAboutUs(sendData)
                }
            })
            .catch(error => {
                notification.warning({
                    message: `Notification`,
                    description: 'An error occurred, please try again',
                    placement: "bottomRight",
                });
            });

    }

    return (
        <div>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <h1 className={classes.h1}>{lang.site_about}</h1>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/* Advanced settings section */}
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h2 className={`${classes.h1} ${classes.h2}`}>{lang.advanced_settings}:</h2>
                            <hr/>
                            {
                                isLoading ? <Spin/> :
                                    <AboutUsSettings isLoading={isLoading} sendData={sendData} data={{...data}}
                                                     lang={lang}/>
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
        getAboutUsData: () => {
            dispatch(fetchAboutUs())
        },
        changeAboutUs: (data) => {
            dispatch(changedCategory(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutUs)