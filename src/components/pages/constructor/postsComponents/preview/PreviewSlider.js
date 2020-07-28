import React from "react";
import {useSelector} from "react-redux";
import Carousel from 'react-material-ui-carousel';
import {Paper, CardMedia} from '@material-ui/core'

function PreviewSlider() {
    const {home} = useSelector(state => state);
    let {slide} = home.site.post;

    const renderImagesSlider = (images) => {
        return images.map((image, index) => (
            <Paper key={index}>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    image={image.thumbUrl}
                    title="Contemplative Reptile"
                />
            </Paper>
        ))
    }

    if (!slide.length) {
        return null
    }

    return (
        <Carousel autoplay>
            {renderImagesSlider(slide)}
        </Carousel>
    )
}

export default PreviewSlider;