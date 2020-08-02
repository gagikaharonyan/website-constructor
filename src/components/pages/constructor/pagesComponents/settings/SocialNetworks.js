import React, {useState} from "react";
import {connect, useSelector} from 'react-redux';
import {change_page_data,add_update_networks_links} from "../../../../../store/actions/homeAction";
import {useToasts} from "react-toast-notifications";
import {makeStyles} from '@material-ui/core/styles';
import {Button, InputLabel, MenuItem, FormControl, Select, Grid, TextField} from '@material-ui/core';
import {Facebook, Instagram, Pinterest, SupervisorAccount, Twitter, Link, Clear} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    form: {
        '& > label': {
            color: 'black',
            display: 'inline-block',
            fontSize: 16,
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    btn: {
        '& svg': {
            marginRight: 5,
        },
    },
    h4: {
        display: "flex",
        fontSize: 17,
        color: '#000',
        fontWeight: 600,
    },
    delItem: {
        position: "relative",
        marginLeft: 30,
        '& span svg': {
            position: 'absolute',
            fontSize: 13,
            color: 'black',
        },
        '& span:hover svg': {
            color: 'red',
            cursor: 'pointer',
        },
        '& a': {
            fontSize: 16,
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            textDecoration: 'underline'
        },
    },
    contactData: {
        textAlign: "left",
    },
}));

const networks = [
    {value: "facebook", name: "Facebook"},
    {value: "instagram", name: "Instagram"},
    {value: "pinterest", name: "Pinterest"},
    {value: "twitter", name: "Twitter"},
];

function SocialNetworks(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const [network, setNetwork] = useState('');
    const [link, setLink] = useState('');
    const {home} = useSelector(state => state);
    const {lang} = props;
    const networkLinks = home.site.navBar.networks || {};

    const handleChange = (ev) => {
        setNetwork(ev.target.value);
    };

    const handleChangeLink = (ev) => {
        setLink(ev.target.value);
    };

    const deleteLink = (item) => {
        const delData = {...networkLinks};
        delData[item] = "";
        props.addUpdateNetworksLinks({...delData});
    }

    const addLink = () => {
        if(link === ""){
            addToast(lang.error_empty_value, {
                appearance: 'error',
                autoDismiss: true,
            });
        }else{
            const addData = {...networkLinks};
            addData[network] = link;
            setLink("");
            setNetwork("");
            props.addUpdateNetworksLinks({...addData});
        }
    }

    return (
        <div>
            <form action="/" className={classes.form}>
                <label htmlFor="social-networks">{lang.add_link}:</label>
                <br/>
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="social-networks">{lang.network}</InputLabel>
                                <Select
                                    labelId="social-networks"
                                    id="social-networks"
                                    value={network}
                                    onChange={handleChange}
                                    label={lang.network}
                                >
                                    <MenuItem value="">
                                        <em>{lang.none}</em>
                                    </MenuItem>
                                    {networks.map(item => (
                                        <MenuItem value={item.value} key={item.value}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField id="link" label={lang.link} variant="outlined" className={classes.formControl}
                                value={link} onChange={(ev)=>handleChangeLink(ev)}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.contactData}>
                            <h4 className={`${classes.h4}`}>
                                <Link />&nbsp;{lang.links}
                            </h4>
                            <hr/>
                            <div>
                                { Object.keys(networkLinks).length > 0
                                    && Object.keys(networkLinks).map(item => (
                                        networkLinks[item] !== "" ?
                                        <span className={classes.delItem} key={item}>
                                            <a href={networkLinks[item]}>{item}</a>
                                            <span onClick={() => deleteLink(item)}>
                                                <Clear/>
                                            </span>
                                        </span> : null
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type={"button"} className={classes.btn} onClick={()=>addLink()}>
                                {(() => {
                                    switch (network) {
                                        case "facebook":
                                            return <Facebook />
                                        case "instagram":
                                            return <Instagram />
                                        case "pinterest":
                                            return <Pinterest />
                                        case "twitter":
                                            return <Twitter />
                                        default: return <SupervisorAccount />;
                                    }
                                })()} {lang.add}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </form>
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
        addUpdateNetworksLinks: (data) => {dispatch(add_update_networks_links(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SocialNetworks);