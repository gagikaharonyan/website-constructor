import React, {useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import {connect, useSelector} from 'react-redux';
import {change_page_data} from "../../../store/actions/homeAction";
import Layout from '../../../hoc/layout/Layout';
import AsideLeft from './AsideLeft';
import Main from "./Main";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
}));

function Home(props) {
    const classes = useStyles();
    const [tempPageSection, setTempPageSection] = useState('');
    const {home} = useSelector(state => state);
    const {lang} = props;

    const pageCreator = (type) => {
        setTempPageSection(type);
        props.changeHomeState({...home, currentAction: type, currentSetting: ""});
    }

    const showPagesSettings = (type) => {
        props.changeHomeState({...home, currentSetting: type});
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
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout(Home));