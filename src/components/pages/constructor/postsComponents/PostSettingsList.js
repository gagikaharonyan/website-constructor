import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import ViewListIcon from '@material-ui/icons/ViewList';

function PostSettings(props) {
    const {lang, showPagesSettings} = props

    const settingsData = [
        {name: "slider", title: "post_slide", icon: <PhotoLibraryIcon/>},
        {name: "heading", title: "post_heading", icon: <FormatColorTextIcon/>},
        {name: "photo", title: "post_photo", icon: <AddPhotoAlternateIcon/>},
        {name: "paragraph", title: "post_paragraph", icon: <VerticalSplitIcon/>},
        {name: "video", title: "post_video", icon: <VideoCallIcon/>},
        {name: "quote", title: "post_quote", icon: <FormatQuoteIcon/>},
        {name: "listPosts", title: "list_Posts", icon: <ViewListIcon/>},
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