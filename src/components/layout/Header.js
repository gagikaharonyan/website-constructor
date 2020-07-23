import React, { useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_admin_status} from "../../store/actions/adminAction";
import {Redirect, useRouteMatch} from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, List, ListItem,
  Grid, SwipeableDrawer,
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
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
        flex: 1,
        color: 'inherit',
        '& figure': {
            margin: 0,
            '& img': {
                width: 50,
                height: 50,
            },
        },
        '& span': {
            fontSize: 18,
            display: 'inline-block',
            marginBottom: 5,
        },
    },
    menu: {
        flex: 5,
    },
    logInBtn: {
        backgroundColor: '#ffffff',
        fontWeight: 500,
        padding: '5px 25px',
    },
    list : {
        width : 200,
    },
    padding : {
        paddingRight : 30,
        cursor : "pointer",
    },
    sideBarIcon : {
        padding : 0,
        color : "#000000",
        cursor : "pointer",
    }
});

function Header(props) {
    const classes = useStyle();
    const {admin} = useSelector(state => state);
    const [isDrawerActive, setIsDrawerActive] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [redirectTo, setRedirectTo]= useState(false);
    let match = useRouteMatch();
    const {lang} = props;

    useEffect(() => {
        const adminId = localStorage.getItem("adminId");
        if(window.innerWidth <= 600){
            setIsDrawerActive(true);
        }
  
        window.addEventListener('resize',()=>{
            if(window.innerWidth <= 600){
                setIsDrawerActive(true);
            }
            else{
                setIsDrawerActive(false);
            }
        });

        if(match.path === "/" && redirectTo === true){
            setRedirectTo(false)
        }

        if(!admin.isLogged && !adminId){
            setRedirectTo(true)
        }
    },[redirectTo]);

    const handleLogout = (ev) => {
        ev.preventDefault();
        Firebase.doSignOut();
        props.changeAdminState({isLogged: false});
        localStorage.clear();
        setRedirectTo(true);
    }

    //Small Screens
    const createDrawer = () => (
        <>
            <AppBar className={classes.header}>
                <Toolbar>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Menu
                            className={classes.sideBarIcon}
                            onClick={() => {
                                setIsDrawerOpen(true)
                            }}/>
                        <Typography className={classes.logo} variant="inherit">
                            {lang.site_name}
                        </Typography>
                    </Grid>
                </Toolbar>
            </AppBar>

            <SwipeableDrawer
                open={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false)
                }}
                onOpen={() => {
                    setIsDrawerOpen(true)
                }}>

                <div
                    tabIndex={0}
                    role="button"
                    onClick={() => {
                        setIsDrawerOpen(false)
                    }}
                    onKeyDown={() => {
                        setIsDrawerOpen(false)
                    }}>

                    <List className={classes.list}>
                        <ListItem key={1} button divider> Option 1 </ListItem>
                        <ListItem key={2} button divider> Option 2 </ListItem>
                        <ListItem key={3} button divider> Option 3 </ListItem>
                        <ListItem key={4} button divider onClick={handleLogout}> {lang.logout} </ListItem>
                    </List>
                </div>
            </SwipeableDrawer>
        </>
    );

    //Larger Screens
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
                <div className={classes.menu}>
                    <Typography variant="inherit" className={classes.padding} color="inherit">OPTION 1</Typography>
                    <Typography variant="inherit" className={classes.padding} color="inherit">OPTION 2</Typography>
                    <Typography variant="inherit" className={classes.padding} color="inherit">OPTION 3</Typography>
                </div>
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
            {isDrawerActive ? createDrawer() : destroyDrawer()}
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
