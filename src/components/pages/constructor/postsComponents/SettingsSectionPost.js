import React from "react"
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {AssignmentLate} from '@material-ui/icons';

/* tools components */
import Slider from "./settings/Slider";
import Heading from "./settings/Heading";
import Photo from "./settings/Photo";
import Paragraph from "./settings/Paragraph";
import Video from "./settings/Video";
import Quote from "./settings/Quote";
import ListPosts from "./settings/ListPosts";

const useStyles = makeStyles(() => ({
    noSelected: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& span': {
            marginLeft: 2,
            color: ' #393939',
            fontWeight: 600,
        },
    },
    h3: {
        color: '#000',
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
        fontSize: 15,
        textAlign: 'left',
    },
}));

function SettingsSectionPost(props) {
    const classes = useStyles();
    const {home} = useSelector(state => state);
    const {lang} = props;
    let title = "";
    let type = home.currentSetting;

    switch (type) {
        case "slider":
            title = "post_slide";
            break;
        case "heading":
            title = "post_heading";
            break;
        case "photo":
            title = "post_photo";
            break;
        case "paragraph":
            title = "post_paragraph";
            break;
        case "video":
            title = "post_video";
            break;
        case "quote":
            title = "post_quote";
            break;
        case "listPosts":
            title = "List Posts";
            break;
        default:
            title = "settings";
    }

    const notSelected = (
        <div className={classes.noSelected}>
            <AssignmentLate/>
            <span>{lang.no_tool_selected}!</span>
        </div>
    );

    return (
        <div>
            <h3 className={classes.h3}>{home.currentSetting !== "" ? lang[title] : lang.settings}</h3>
            {(() => {
                switch (type) {
                    case "slider":
                        return <Slider lang={lang}/>
                    case "heading":
                        return <Heading lang={lang}/>
                    case "photo":
                        return <Photo lang={lang}/>
                    case "paragraph":
                        return <Paragraph lang={lang}/>
                    case "video":
                        return <Video lang={lang}/>
                    case "quote":
                        return <Quote lang={lang}/>
                    case "listPosts":
                        return <ListPosts lang={lang}/>
                    default:
                        return notSelected;
                }
            })()
            }

        </div>
    )

}

export default SettingsSectionPost