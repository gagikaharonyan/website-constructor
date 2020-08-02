import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import ViewListIcon from '@material-ui/icons/ViewList';
import AddIcon from '@material-ui/icons/Add';

function PostSettings(props) {
    const {lang, showPagesSettings} = props

    const settingsData = [
        {name: "listPosts", title: "list_Posts", icon: <ViewListIcon/>},
        {name: "createNewPost", title: "create_new_Post", icon: <AddIcon/>},
    ];

    return (
        <>
            {settingsData.map(item => (
                <ListItem button key={item.name} onClick={() => showPagesSettings(item.name)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={lang[item.title]}/>
                </ListItem>
            ))}
        </>
    );
}

export default PostSettings;