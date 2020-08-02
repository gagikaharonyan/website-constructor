import React, { useState } from 'react';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import {change_admin_status} from  '../../../store/actions/adminAction';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button}  from '@material-ui/core';
import {Lock} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import Firebase from "../../../Firebase/Firebase";
import reg from '../../../constants'

const useStyles = makeStyles({
    root: {
        width: 400,
        display: 'flex',
        flexDirection: 'column',
    },
    textInput: {
        marginBottom: 20,
    },
    loginIcon: {
        height: 55,
        display: 'flex',
        justifyContent: 'center',
        '& > div': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: 50,
            backgroundColor: '#80808085',
            borderRadius: '50%',
            '& > svg': {
                color: 'white'
            }
        },
    },
    errorMessage: {
        color: 'red',
        margin: '5px',
    },
});


const initAdminData = {
    login: "",
    password: "",
}

const initValidator = {
    login: false,
    password: false,
}

function LoginForm(props) {
    const classes = useStyles();
    const { addToast } = useToasts();
    const [adminData, setAdminData] = useState(initAdminData)
    const [validator, setValidator] = useState(initValidator);
    const [redirectTo, setRedirectTo] = useState(false);
    const {lang} = props


    const handleChangeData = (ev) => {
        const name = ev.target.name
        let value = ev.target.value
        setAdminData(prevState => {
            return {
                ...prevState,
                [name]: value,
            }
        })

        switch (name) {
            case "login":
                !reg.email_reg.test(value) ?
                    setValidator(prevState => {return {...prevState, [name]: true}}) :
                    setValidator(prevState => {return {...prevState, [name]: false}})
                break
            case "password":
                !reg.pass_reg.test(value) ?
                    setValidator(prevState => {return {...prevState, [name]: true}}) :
                    setValidator(prevState => {return {...prevState, [name]: false}})
                break
            default:
                return validator
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(adminData.login === "" || adminData.password === ""){
            setValidator(prevState => { return {
                ...prevState, login: !adminData.login, password: !adminData.password,
            }})
            return false
        }

        Firebase.doSignInWithEmailAndPassword(adminData.login, adminData.password).then(function (data) {
            if (data && data.user && data.user.uid) {
                props.changeAdminState({isLogged: true})
                localStorage.setItem("adminId", data.user.uid)
                setRedirectTo(true)
            }
        }).catch(function (error) {
            console.log('error',error);
            addToast(lang.error_login_message, {
                appearance: 'error',
                autoDismiss: true,
            });
        });
    }

    if (redirectTo === true) {
        return <Redirect to="/"/>
    }
    return (
        <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div className={classes.loginIcon}>
                <div><Lock/></div>
            </div>
            <h2>{lang.log_in}</h2>
            <TextField className={classes.textInput} label={lang.login} name={"login"} value={adminData.login} onChange={e => handleChangeData(e)}/>
            {validator.login && <span className={classes.errorMessage}>{lang.error_reg_login}</span>}
            <TextField type="password" className={classes.textInput} label={lang.password} name={"password"} value={adminData.password} onChange={e => handleChangeData(e)}/>
            {validator.password && <span className={classes.errorMessage}>{lang.error_reg_pass}</span>}
            <Button type="submit" color="primary" disabled={(validator.login || validator.password)}>{lang.login}</Button>
        </form>
    );
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeAdminState: (data) => {dispatch(change_admin_status(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginForm)