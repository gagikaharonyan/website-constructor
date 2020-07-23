import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, List, Divider, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems, SecondaryListItems } from './listItems';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
}));

export default function AsideLeft(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const {lang, pageCreator} = props;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    {open ?
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    :
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    }
                </div>
                <Divider />
                <List><MainListItems lang={lang} pageCreator={pageCreator}/></List>
                <Divider />
                <List><SecondaryListItems /></List>
            </Drawer>
        </>
    );
}