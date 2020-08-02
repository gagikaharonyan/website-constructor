import React, {useEffect, useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import {connect, useSelector} from 'react-redux';
import {change_page_data, change_nav_bar_data, change_current_settings} from "../../../store/actions/homeAction";
import Layout from '../../../hoc/layout/Layout';
import AsideLeft from './AsideLeft';
import Main from "./Main";
import {makeStyles} from "@material-ui/core/styles";
import {useToasts} from "react-toast-notifications";
import FirebaseFunctions from "../../../Firebase/FirebaseFunctions";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
}));

function Home(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const [tempPageSection, setTempPageSection] = useState('');
    const {home} = useSelector(state => state);
    const {lang} = props;

    useEffect(function () {
        getNavBardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const getNavBardData = () => {
        FirebaseFunctions.getData("nav-bar")
            .then(response => {
                if (Object.keys(response).length > 0) {
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

    const pageCreator = (type) => {
        setTempPageSection(type);
        props.changeHomeState({...home, currentAction: type, currentSetting: ""});
    }

    const showPagesSettings = (type) => {
        props.changeCurrentSettings(type);
    }

    return (
        <div className={`main-content`}>
            <div className={classes.root}>
                <CssBaseline />
                <AsideLeft
                    lang={lang}
                    pageCreator={pageCreator}
                    showPagesSettings={showPagesSettings}
                />
                <Main lang={lang} activeAction={tempPageSection}/>
            </div>
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
        changeCurrentSettings: (data) => {dispatch(change_current_settings(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout(Home));