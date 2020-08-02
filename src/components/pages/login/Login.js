import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from './LoginForm';
import Layout from '../../../hoc/layout/Layout'

const useStyle = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    }
});

function Login(props) {
    const classes = useStyle();
    const {lang} = props

    return (
        <div className={classes.root}>
            <LoginForm lang={lang}/>
        </div>
    );
}

export default Layout(Login,"login");