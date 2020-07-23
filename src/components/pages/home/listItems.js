import React from 'react';
import {ListItem, ListItemIcon, ListItemText,ListSubheader } from '@material-ui/core';
import {PostAdd, FormatQuote, Dashboard, YouTube, Pages, Assignment} from '@material-ui/icons';

function MainListItems(props) {
    const {lang, pageCreator} = props;

    const firstList = [
        {id:1, name: lang.pages_, icon: <Pages />, type: "nav-bar"},
        {id:2, name: lang.slide_banner, icon: <Dashboard />, type: "banner"},
        {id:3, name: lang.post, icon: <PostAdd />, type: "post"},
        {id:4, name: lang.quote, icon: <FormatQuote />, type: "quote"},
        {id:5, name: lang.video, icon: <YouTube />, type: "video"},
    ];

    return(
        <div>
            {firstList.map(item=>(
                <ListItem button key={item.id} onClick={()=>pageCreator(item.type)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItem>
            ))}
        </div>
    );
}

function SecondaryListItems(){

    return (
        <div>
            <ListSubheader inset>Empowerment</ListSubheader>
            <ListItem button>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="Current type" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="Last type" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="New type" />
            </ListItem>
        </div>
    );
}

export {MainListItems, SecondaryListItems};