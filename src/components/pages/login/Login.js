import React, {useState, useEffect} from 'react';
import LoginForm from './LoginForm';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function Login(props) {
    const classes = useStyle();
    return (<div className={classes.root}>
        <LoginForm/>
    </div>);
}

export default Login;