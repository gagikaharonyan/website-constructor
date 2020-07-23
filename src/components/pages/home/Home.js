import React, {useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
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
    const {lang} = props;

    const pageCreator = (type) => {
        setTempPageSection(type)
    }

    return (
        <div className={`main-content`}>
            <div className={classes.root}>
                <CssBaseline />
                <AsideLeft lang={lang} pageCreator={pageCreator}/>
                <Main activeAction={tempPageSection}/>
            </div>
        </div>
    )
}

export default Layout(Home);