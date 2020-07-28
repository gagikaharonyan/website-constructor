import React from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";

function PreviewVideo() {
    const {home} = useSelector(state => state);
    let {videoUrl} = home.site.post;

    const youtubeParser = (url) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }

    if (!videoUrl.trim().length) {
        return null
    }


    return (
        <Paper>
            <iframe width="560" title="title" height="315"
                    src={`https://www.youtube.com/embed/${youtubeParser(videoUrl)}`} frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen/>
        </Paper>
    )
}

export default PreviewVideo;