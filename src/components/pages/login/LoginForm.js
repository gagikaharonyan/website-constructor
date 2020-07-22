import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Firebase from "../../../Firebase/Firebase";

const useStyles = makeStyles({
    root: {
        width: 400,
        display: 'flex',
        flexDirection: 'column',
    },
    textInput: {
        marginBottom: 20,

    }

});

export default function BasicTextFields() {
    const classes = useStyles();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(login + password)
        Firebase.doSignInWithEmailAndPassword(login,password).then(function (data) {
            if (data && data.user && data.user.uid) {
                console.log('data',data.user.uid)
            }
        }).catch(function (error) {
            console.log('error',error)
        })
    }
    return (
        <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <h2>Log In</h2>
            <TextField className={classes.textInput} label="Login" value={login} onChange={e => setLogin(e.target.value)}/>
            <TextField className={classes.textInput} label="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            <Button type="submit" color="primary">Login</Button>
        </form>);
}