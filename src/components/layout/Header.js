import React, { useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_admin_status} from "../../store/actions/adminAction";
import {Redirect, useRouteMatch} from 'react-router-dom';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Firebase from "../../Firebase/Firebase";

const useStyle = makeStyles({
    header: {
        backgroundColor: '#ffffff',
        color: '#000000',
        position: 'initial',
    },
    logo: {
        flex: 3,
        color: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        '& figure': {
            margin: 0,
            display: 'inline-block',
            '& img': {
                width: 50,
                height: 50,
            },
        },
        '& span': {
            fontSize: 18,
            display: 'inline-block',
            color: 'black',
        },
    },
    menu: {
        flex: 3,
    },
});

function Header(props) {
    const classes = useStyle();
    const {admin} = useSelector(state => state);
    const [redirectTo, setRedirectTo]= useState(false);
    let match = useRouteMatch();
    const {lang} = props;

    useEffect(() => {
        const adminId = localStorage.getItem("adminId");

        if(match.path === "/" && redirectTo === true){
            setRedirectTo(false)
        }

        if(!admin.isLogged && !adminId){
            setRedirectTo(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[redirectTo]);

    const handleLogout = (ev) => {
        ev.preventDefault();
        Firebase.doSignOut();
        props.changeAdminState({isLogged: false});
        localStorage.clear();
        setRedirectTo(true);
    }

    const destroyDrawer = () => (
        <AppBar className={`${classes.header} main-header`}>
            <Toolbar>
                <Link to="/">
                    <Typography variant="inherit" className={classes.logo}>
                        <figure>
                            <img src="/images/logo-c.png" alt="logo"/>
                        </figure>
                        <span>{lang.site_name}</span>
                    </Typography>
                </Link>
                <div className={classes.menu}/>
                <Link to='/' onClick={handleLogout}>
                    {lang.logout}
                </Link>
            </Toolbar>
        </AppBar>
    );

    if (redirectTo === true) {
        return <Redirect to="/login" />
    }

    return(
        <>
            {destroyDrawer()}
        </>
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

export default connect(mapStateToProps,mapDispatchToProps)(Header)
