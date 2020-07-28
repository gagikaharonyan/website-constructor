import React from "react";
import {useSelector} from "react-redux";

function PreviewParagraph() {
    const {home} = useSelector(state => state);
    let {paragraph} = home.site.post;

    if (!paragraph.trim().length) {
        return null
    }

    return (
        <div style={{textAlign: 'start'}} dangerouslySetInnerHTML={{__html: paragraph}}/>
    )
}

export default PreviewParagraph;