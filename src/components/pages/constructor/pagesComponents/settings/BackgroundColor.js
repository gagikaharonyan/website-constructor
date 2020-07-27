import React, {useState, useEffect} from "react";
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
    colorType: {
        height: 40,
        width: 75,
        border: '1px solid black',
        borderRadius: 4,
    },
}));

const colors = ['#007bff','#545b62','#28a745','#dc3545','#ffc107', '#17a2b8', '#343a40'];

function BackgroundColor(props) {
    const classes = useStyles();
    const {home} = useSelector(state => state);
    const [color, setColor] = useState("#ffffff");
    const {lang} = props;

    useEffect(function () {
        if(home.site.navBar.backgroundColor !== ""){
            setColor(home.site.navBar.backgroundColor);
        }
    },[]);

    const changeColor = (color) => {
        setColor(color)
    }

    const setNewColor = (ev) => {
        ev.preventDefault();
        props.changeNavBarSettings("backgroundColor", color);
    }

    return (
        <div>
            <form action="/" className={classes.form}>
                <label htmlFor="fav-color">{lang.select_color}:</label><br/>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="position" name="position" defaultValue="top" value={color}>
                        {colors.map(item => (
                            <FormControlLabel
                                key={item}
                                value={item}
                                control={<Radio color="primary" />}
                                label={<div className={classes.colorType} style={{backgroundColor: item}}/>}
                                labelPlacement="top"
                                onChange={()=>changeColor(item)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <br/>
                <Button variant="contained" color="primary" type={"button"} onClick={(ev)=>setNewColor(ev)}>
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

export default connect(mapStateToProps,mapDispatchToProps)(BackgroundColor)