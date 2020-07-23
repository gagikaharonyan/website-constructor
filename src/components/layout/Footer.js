import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {PhoneIphone, Copyright, LocationOn} from '@material-ui/icons';

const useStyles = makeStyles({
    root: {
        width: 500,
    },
    footerSection: {
        height: 76,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
    },
});

export default function Footer(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const {lang} = props;

    return (
        <div className={`${classes.footerSection} main-footer`}>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label={lang.location} icon={<LocationOn />} />
                <BottomNavigationAction label={lang.company_name} icon={<Copyright />} />
                <BottomNavigationAction label={lang.phone_number_} icon={<PhoneIphone />} />
            </BottomNavigation>
        </div>
    );
}

