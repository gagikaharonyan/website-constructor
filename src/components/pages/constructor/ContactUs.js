import React, {useEffect, useState} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_page_data,change_contact_us_state,add_contact_data} from "../../../store/actions/homeAction";
import {useToasts} from 'react-toast-notifications';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Grid, TextField, Button} from '@material-ui/core';
import {Add, Save, Delete, AlternateEmail, PhoneIphone, Business, Clear} from '@material-ui/icons';
import Loader from "react-loader-spinner";
import FirebaseFunctions from "../../../Firebase/FirebaseFunctions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight: 500,
        height: "auto",
        fontSize: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& > span': {
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
    loader: {
        margin: '0 10px',
        '& figure > div': {
            verticalAlign: 'middle',
            display: 'inline-block',
        },
    },
    inputSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    contactData: {
        textAlign: "left",
    },
    h4: {
        display: "flex",
        fontSize: 17,
    },
    noData: {
        display: "flex",
        alignItems: "center",
        fontSize: 15,
    },
    delItem: {
        position: "relative",
        marginLeft: 15,
        '& span svg': {
            position: 'absolute',
            fontSize: 13,
            color: 'black',
        },
        '& span:hover svg': {
            color: 'red',
            cursor: 'pointer',
        },
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
    const [_loader, setLoader] = useState(false);
    const {lang} = props;
    const contactsData = home.site.contactUs;

    useEffect(function () {
        const temp = home.site.contactUs;
        if(!temp[0]){
            getContactsData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const getContactsData = () => {
        FirebaseFunctions.getData("contacts")
            .then(response => {
                if (response.length > 0) {
                    const dataArr = response.map(item => {
                        return {type: item.type, text:item.text};
                    });
                    props.changeContactUsState( [ ...dataArr]);
                }
            })
            .catch(error => {
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            });
    }

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

    const addNewInfo = (type) => {
        if(noValid.phone || noValid.email){
            addToast(lang.incorrect_data, {
                appearance: 'error',
                autoDismiss: true,
            });
        }else {
            props.addContactData({type: type, text: contacts[type]});
            setContacts(prevState => {
                return {...prevState, [type]: ""};
            });
        }
    }

    const deleteContactData = (item) => {
        const delData = contactsData.filter(cont => cont.text !== item);
        props.changeContactUsState([...delData]);
    }

    const saveContactsData = (ev) => {
        ev.preventDefault();
        setLoader(true);
        FirebaseFunctions.updateData("contacts", {...contactsData})
            .then(response => {
                setLoader(false);
                if(response.result){
                    addToast(lang.data_updated_successfully, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
                }
            })
            .catch(error => {
                setLoader(false);
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2 className={`${classes.h1}`}>{lang.contact_us_data}</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.form} autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} className={classes.inputSection}>
                                    <TextField
                                        required
                                        name={"EMAIL"}
                                        label={lang.email}
                                        variant="outlined"
                                        value={contacts.EMAIL}
                                        error={noValid.email}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                    <Button variant="contained" color="primary" onClick={()=>addNewInfo("EMAIL")}>
                                        <Add /> {lang.add}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} className={classes.inputSection}>
                                    <TextField
                                        required
                                        name={"PHONE_NUMBER"}
                                        label={lang.phone_number}
                                        variant="outlined"
                                        value={contacts.PHONE_NUMBER}
                                        error={noValid.phone}
                                        onChange={(ev) => handleChange(ev)}
                                    />
                                    <Button variant="contained" color="primary" onClick={()=>addNewInfo("PHONE_NUMBER")}>
                                        <Add /> {lang.add}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} className={classes.inputSection}>
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
                                    <Button variant="contained" color="primary" onClick={()=>addNewInfo("LOCATION")}>
                                        <Add /> {lang.add}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} className={classes.contactData}>
                                    <h4 className={`${classes.h1} ${classes.h4}`}>
                                        <AlternateEmail />&nbsp;{lang.emails}
                                    </h4>
                                    <hr/>
                                    <div>
                                        {contactsData.length > 0 ?
                                            contactsData.map(item => {
                                                if (item.type === "EMAIL") {
                                                    return (
                                                        <span key={item.text} className={classes.delItem}>
                                                            {item.text}
                                                            <span onClick={()=>deleteContactData(item.text)}>
                                                                <Clear />
                                                            </span>
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                            :
                                            <span className={classes.noData}><Delete /> {lang.no_data}</span>
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={12} className={classes.contactData}>
                                    <h4 className={`${classes.h1} ${classes.h4}`}>
                                        <PhoneIphone />&nbsp;{lang.phones}
                                    </h4>
                                    <hr/>
                                    <div>
                                        {contactsData.length > 0 ?
                                            contactsData.map(item => {
                                                if(item.type === "PHONE_NUMBER"){
                                                    return (
                                                        <span key={item.text} className={classes.delItem}>
                                                            {item.text}
                                                            <span onClick={()=>deleteContactData(item.text)}>
                                                                <Clear />
                                                            </span>
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                            :
                                            <span className={classes.noData}><Delete /> {lang.no_data}</span>
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={12} className={classes.contactData}>
                                    <h4 className={`${classes.h1} ${classes.h4}`}>
                                        <Business />&nbsp;{lang.addresses}
                                    </h4>
                                    <hr/>
                                    <div>
                                        {contactsData.length > 0 ?
                                            contactsData.map(item => {
                                                if(item.type === "LOCATION"){
                                                    return (
                                                        <span key={item.text} className={classes.delItem}>
                                                            {item.text}
                                                            <span onClick={()=>deleteContactData(item.text)}>
                                                                <Clear />
                                                            </span>
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                            :
                                            <span className={classes.noData}><Delete /> {lang.no_data}</span>
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type={"submit"} disabled={_loader}
                                        onClick={(ev) => saveContactsData(ev)}>
                                        <Save />&nbsp;
                                        {lang.save}
                                        {_loader ?
                                            <figure className={classes.loader}>
                                                <Loader type="ThreeDots" color="#fff" height={15} width={40}/>
                                            </figure> : null
                                        }
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
        changeContactUsState: (data) => {dispatch(change_contact_us_state(data))},
        addContactData: (data) => {dispatch(add_contact_data(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactUs);