import React from "react";
import {useSelector} from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {AssignmentLate} from "@material-ui/icons";

/* preview apply settings */
import PreviewSlider from "./preview/PreviewSlider";
import PreviewParagraph from "./preview/PreviewParagraph";
import PreviewPhoto from "./preview/PreviewPhoto";
import PreviewVideo from "./preview/PreviewVideo";
import PreviewItemList from "./preview/PreviewItemList";

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
    }
}));

function PreviewSettings(props) {
    const {home} = useSelector(state => state);
    const {lang} = props;
    const classes = useStyles();
    let type = home.currentSetting;

    const notSelected = (
        <div className={classes.noSelected}>
            <AssignmentLate/>
            <span>{lang.no_tool_selected}!</span>
        </div>
    );

    const notPreview = (text) => (
        <div className={classes.noSelected}>
            <AssignmentLate/>
            <span>{text}!</span>
        </div>
    );

    return (
        <div>
            {(() => {
                switch (type) {
                    case "slider":
                        return <PreviewSlider lang={lang}/>
                    case "heading":
                        return notPreview(lang.no_preview_heading)
                    case "photo":
                        return <PreviewPhoto lang={lang}/>
                    case "paragraph":
                        return <PreviewParagraph lang={lang}/>
                    case "video":
                        return <PreviewVideo lang={lang}/>
                    case "quote":
                        return notPreview(lang.no_preview_quote)
                    case "listPosts":
                        return <PreviewItemList lang={lang}/>
                    default:
                        return notSelected;
                }
            })()
            }
        </div>
    )
}

export default PreviewSettings