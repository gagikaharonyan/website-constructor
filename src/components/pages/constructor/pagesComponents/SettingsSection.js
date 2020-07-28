import React from "react";
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {AssignmentLate} from '@material-ui/icons';

/* tools components */
import BackgroundColor from "./settings/BackgroundColor";
import TextColor from "./settings/TextColor";
import FontFamily from "./settings/FontFamily";
import SocialNetworks from "./settings/SocialNetworks";
import SliderImages from "./settings/SliderImages";

const useStyles = makeStyles(() => ({
    noSelected: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& span': {
            marginLeft: 2,
            color:' #393939',
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

function SettingsSection(props) {
    const classes = useStyles();
    const {home} = useSelector(state => state);
    const {lang} = props;
    let title = "";
    let type = home.currentSetting;

    switch(type) {
        case "backgroundColor":
            title = "background_color";
            break;
        case "textColor":
            title = "text_color";
            break;
        case "fontFamily":
            title = "font_family";
            break;
        case "socialNetworks":
            title = "social_networks";
            break;
        case "sliderImages":
            title = "slider_images";
            break;
        default:
            title = "settings";
    }

    const notSelected = (
        <div className={classes.noSelected}>
            <AssignmentLate />
            <span>{lang.no_tool_selected}!</span>
        </div>
    );

    return (
        <div>
            <h3 className={classes.h3}>{ home.currentSetting !== "" ? lang[title]: lang.settings}</h3>
            <div>
                {/* advanced settings tools */}
                {(() => {
                    switch (type) {
                        case "backgroundColor":
                            return <BackgroundColor lang={lang}/>
                        case "textColor":
                            return <TextColor lang={lang}/>
                        case "fontFamily":
                            return <FontFamily lang={lang}/>
                        case "socialNetworks":
                            return <SocialNetworks lang={lang}/>
                        case "sliderImages":
                            return <SliderImages lang={lang}/>
                        default: return notSelected;
                    }
                })()}
            </div>
        </div>
    )
}

export default SettingsSection;