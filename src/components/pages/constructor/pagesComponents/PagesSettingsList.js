import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {SupervisorAccount, BurstMode} from "@material-ui/icons";

function PagesSettingsList(props) {
    const {lang, showPagesSettings} = props

    const settingsData = [
        {name: "socialNetworks", title: "social_networks", icon: <SupervisorAccount/>},
        {name: "sliderImages", title: "slider_images", icon: <BurstMode/>},
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

export default PagesSettingsList;