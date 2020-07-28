import React from "react";
import {useSelector} from "react-redux";
import {CardMedia, Paper} from "@material-ui/core";

function PreviewPhoto() {
    const {home} = useSelector(state => state);
    let {photo} = home.site.post;

    if (!photo.length) {
        return null
    }

    return (
        <Paper>
            <CardMedia
                component="img"
                alt="Contemplative Reptile"
                image={photo[0].thumbUrl}
                title="Contemplative Reptile"
            />
        </Paper>
    )
}

export default PreviewPhoto;