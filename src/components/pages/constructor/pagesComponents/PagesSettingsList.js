import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ColorLens, FontDownload, FormatColorText} from "@material-ui/icons";

function PagesSettingsList(props) {
    const {lang, showPagesSettings} = props

    const settingsData = [
        {name: "backgroundColor", title: "background_color", icon: <ColorLens/>},
        {name: "textColor", title: "text_color", icon: <FormatColorText/>},
        {name: "fontFamily", title: "font_family", icon: <FontDownload/>},
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