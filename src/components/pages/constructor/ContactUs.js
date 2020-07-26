import React, {useState} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_page_data} from "../../../store/actions/homeAction";
import {useToasts} from 'react-toast-notifications';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Grid, TextField, Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 500,
        fontSize: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& span': {
            marginLeft: 5,
        },
    },
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    h1: {
        color: '#000',
        fontSize: 30,
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
    },
}));

const email_reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const number_reg = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

const initContacts = {
    EMAIL: "",
    PHONE_NUMBER: "",
    LOCATION: "",
};

const initValidation = {
    phone: false,
    email: false,
}

function ContactUs(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const {home} = useSelector(state => state);
    const [contacts, setContacts] = useState(initContacts);
    const [noValid, setNoValid] = useState(initValidation);
    const {lang} = props;

    const handleChange = (ev) => {
        ev.preventDefault();
        let value = ev.target.value;
        let name = ev.target.name;
        setContacts(prevState=>{
            return {...prevState, [name]: value}
        });

        switch (name) {
            case "EMAIL":
                !email_reg.test(String(value).toLowerCase()) ?
                    setNoValid(noValid => {
                        return {...noValid, email: true}
                    }) :
                    setNoValid(noValid => {
                        return {...noValid, email: false}
                    })
                break
            case "PHONE_NUMBER":
                !number_reg.test(value) ?
                    setNoValid(noValid => {
                        return {...noValid, phone: true}
                    }) :
                    setNoValid(noValid => {
                        return {...noValid, phone: false}
                    })
                break
            default:
                return noValid
        }
    }

    const saveContactsData = (ev) => {
        ev.preventDefault();
        const updateData = Object.keys(contacts).map(item => {
            return {type: item, item: contacts[item]}
        });

        if(noValid.phone || noValid.email){
            addToast(lang.incorrect_data, {
                appearance: 'error',
                autoDismiss: true,
            });
        }else {
            props.changeHomeState({
                    ...home,
                    site: {
                        ...home.site,
                        contactUs: [
                            ...updateData
                        ],
                    }
                }
            );
        }
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2 className={`${classes.h1}`}>{lang.contact_us_data}</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.form} autoComplete="off" onSubmit={(ev) => saveContactsData(ev)}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name={"EMAIL"}
                                        label={lang.email}
                                        variant="outlined"
                                        value={contacts.EMAIL}
                                        error={noValid.email}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name={"PHONE_NUMBER"}
                                        label={lang.phone_number}
                                        variant="outlined"
                                        value={contacts.PHONE_NUMBER}
                                        error={noValid.phone}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        multiline
                                        rowsMax={3}
                                        name={"LOCATION"}
                                        label={lang.location_address}
                                        variant="outlined"
                                        value={contacts.LOCATION}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type={"submit"}>
                                        {lang.save}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
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
        changeHomeState: (data) => {dispatch(change_page_data(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactUs);