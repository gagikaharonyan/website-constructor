import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

function EventsSettingsList(props) {
    const {lang, showPagesSettings} = props;

    const settingsData = [
        {name: "newEvent", title: "new_event", icon: <AddIcon/>},
    ];

    return (
        <>
            {settingsData.map(item => (
                <ListItem button key={item.name} onClick={()=>showPagesSettings(item.name)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={lang[item.title]}/>
                </ListItem>
            ))}
        </>
    );
}

export default EventsSettingsList;