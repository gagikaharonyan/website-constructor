import React, {useEffect, useState} from "react";
import {connect, useSelector} from 'react-redux';
import {change_page_data,change_nav_bar_settings} from "../../../../../store/actions/homeAction";
import {makeStyles} from '@material-ui/core/styles';
import {Button, Radio, RadioGroup, FormControlLabel, FormControl} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    form: {
        '& > label': {
            color: 'black',
            marginBottom: 10,
            display: 'inline-block',
            fontSize: 16,
        },
    },
    fontType: {
        height: 40,
        width: "auto",
    },
}));

const fonts = [
    'Arial, Helvetica, sans-serif', '"Comic Sans MS", cursive, sans-serif', '"Trebuchet MS", Helvetica, sans-serif',
    '"Courier New", Courier, monospace', '"Lucida Console", Monaco, monospace'];

function FontFamily(props) {
    const classes = useStyles();
    const {home} = useSelector(state => state);
    const [font, setFont] = useState("");
    const {lang} = props;

    useEffect(function () {
        if(home.site.navBar.backgroundColor !== ""){
            setFont(home.site.navBar.fontFamily);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const changeFont = (type) => {
        setFont(type)
    }

    const setNewFont = (ev) => {
        ev.preventDefault();
        props.changeNavBarSettings("fontFamily", font);
    }

    return (
        <div>
            <form action="/" className={classes.form}>
                <label htmlFor="fav-color">{lang.select_font}:</label><br/>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="position" name="position" defaultValue="top" value={font}>
                        {fonts.map(item => (
                            <FormControlLabel
                                key={item}
                                value={item}
                                control={<Radio color="primary" />}
                                label={<div className={classes.fontType} style={{fontFamily: item}}>{lang.font_example}</div>}
                                labelPlacement="top"
                                onChange={()=>changeFont(item)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <br/>
                <Button variant="contained" color="primary" type={"button"} onClick={(ev)=>setNewFont(ev)}>
                    {lang.apply}
                </Button>
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
        changeNavBarSettings: (name, data) => {dispatch(change_nav_bar_settings(name, data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FontFamily)