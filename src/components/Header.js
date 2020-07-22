import React, { useState, useEffect} from 'react';
import {
  AppBar, Toolbar, Typography, List, ListItem,
  Grid, SwipeableDrawer
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const useStyle = makeStyles({
    header: {
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    logo: {
        flex: 1,
        color: 'inherit',
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
    const [isDrawerActive, setIsDrawerActive] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const classes = useStyle();

    useEffect(() => {
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
    },[])

    //Small Screens
    const createDrawer = () => (<>
        <AppBar className={classes.header}>
          <Toolbar>
            <Grid container direction = "row" justify = "space-between" alignItems="center">
              <MenuIcon
                className = {classes.sideBarIcon}
                onClick={()=>{setIsDrawerOpen(true)}} />
              <Typography className={classes.logo} variant = "headline">Website constructor</Typography>
              <Typography color="inherit" variant = "headline"></Typography>
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
         open={isDrawerOpen}
         onClose={()=>{setIsDrawerOpen(false)}}
         onOpen={()=>{setIsDrawerOpen(true)}}>

           <div
             tabIndex={0}
             role="button"
             onClick={()=>{setIsDrawerOpen(false)}}
             onKeyDown={()=>{setIsDrawerOpen(false)}}>

            <List className = {classes.list}>
               <ListItem key = {1} button divider> Option 1 </ListItem>
               <ListItem key = {2} button divider> Option 2 </ListItem>
               <ListItem key = {3} button divider> Option 3 </ListItem>
             </List>
         </div>
       </SwipeableDrawer>
      </>);

  //Larger Screens
     const destroyDrawer = () => (
        <AppBar className={classes.header}>
            <Toolbar >
                <Link to="/">
                    <Typography variant = "inherit" className={classes.logo} >Website constructor</Typography>
                </Link>
                <div className={classes.menu}>
                    <Typography variant = "inherit" className = {classes.padding} color="inherit" >OPTION 1</Typography>
                    <Typography variant = "inherit" className = {classes.padding} color="inherit" >OPTION 2</Typography>
                    <Typography variant = "inherit" className = {classes.padding} color="inherit" >OPTION 3</Typography>
                </div>
                <Link to='/login'>Log In</Link>
            </Toolbar>
        </AppBar>);

    return(<>
            {isDrawerActive ? createDrawer() : destroyDrawer()}
        </>);
}


export default Header;
