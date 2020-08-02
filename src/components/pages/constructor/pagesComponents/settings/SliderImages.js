import React, {useState} from "react";
import {connect, useSelector} from 'react-redux';
import {change_page_data,add_update_networks_links,add_update_slider_image} from "../../../../../store/actions/homeAction";
import {set_image,update_images_data} from "../../../../../store/actions/imagesAction";
import {remove_image} from "../../../../../store/actions/removeImagesAction";
import {useToasts} from "react-toast-notifications";
import {makeStyles} from '@material-ui/core/styles';
import {Button, Grid} from '@material-ui/core';
import {PermMedia, PanoramaOutlined, InsertPhotoOutlined, Clear} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    btn: {
        '& svg': {
            marginRight: 5,
        },
    },
    h4: {
        display: "flex",
        fontSize: 17,
        color: '#000',
        fontWeight: 600,
    },
    imageContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileBtn: {
        height: '56px',
        width: '50%',
        color: '#757575',
        fontSize: '1rem',
        '&:hover': {
            backgroundColor: 'white',
            borderColor: 'black'
        }
    },
    fileInput: {
        display: 'none'
    },
    selectedImage: {
        display: 'inline',
        '& div': {
            display: 'inline-block',
        },
    },
    selectedFile: {
        display: 'inline',
        '& img': {
            width: 150,
        },
    },
    loader: {
        '& figure': {
            margin: '0 10px',
            '& > div': {
                verticalAlign: 'middle',
                display: 'inline-block',
            },
        },
    },
    delItem: {
        position: "relative",
        marginLeft: 30,
        '& span svg': {
            position: 'absolute',
            fontSize: 15,
            color: 'black',
        },
        '& span:hover svg': {
            color: 'red',
            cursor: 'pointer',
        },
        '& figure': {
            marginRight: 10,
        },
    },
    warning: {
        textShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: 12,
        marginLeft: 10,
        color: '#f38207',
        '& svg': {
            fontSize: 17,
            marginRight: 3,
        },
    },
}));

const initImageData = {
    selectedFile: null,
    file: null,
    name: null,
};

function SliderImages(props) {
    const classes = useStyles();
    const {addToast} = useToasts();
    const [imageData, setImageData] = useState({...initImageData});
    const {home, images} = useSelector(state => state);
    const {lang} = props;
    const slider = home.site.navBar.slider || [];

    const setImage = e => {
        let file = e.target.files[0];
        const reader = new FileReader();
        if(file !== undefined &&
            (file.type === "image/jpeg" || file.type === "image/png" ||
                file.type === "image/jpg" || file.type === "image/gif")){
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                setImageData(() => {
                    return {
                        selectedFile: reader.result,
                        name: file.name,
                        file
                    }
                });
            }
        }else if(file !== undefined){
            addToast(lang.image_warning, {
                appearance: 'warning',
                autoDismiss: true
            });
        }
    }

    const deleteImage = (name) => {
        const sliderData = [...slider];
        const deleteImage = sliderData.filter(item => item.name !== name);
        props.removeImage({name: name});
        props.addUpdateSliderImage([...deleteImage]);
    }

    const deleteImageFromStore = (name) => {
        const imagesData = [...images];
        const deleteImage = imagesData.filter(item => item.name !== name);
        props.updateImagesData([...deleteImage]);
    }

    const addImage = () => {
        if(imageData.file){
            let name = `${Date.now()}_${imageData.name}`;
            const addData = {...imageData, name};
            props.setNewImage(addData);
            setImageData({...initImageData});
        }else {
            addToast(lang.error_empty_image, {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    }

    return (
        <div>
            <form action="/" className={classes.form}>
                <label htmlFor="social-networks">{lang.add_images}:</label>
                <br/>
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item sm={12} md={6} className={classes.imageContent}>
                                    <Button variant="outlined" component="label" className={classes.fileBtn}>
                                        <PanoramaOutlined htmlColor={"#797979"}/>&nbsp;
                                        {lang.select_image}
                                        <input
                                            type="file"
                                            name={"slide"}
                                            className={classes.fileInput}
                                            onChange={(e)=>setImage(e)}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    {imageData.selectedFile ?
                                        <div className={classes.selectedImage}>
                                            <figure className={classes.selectedFile}>
                                                <img src={imageData.selectedFile} alt="slide"/>
                                            </figure>
                                        </div>
                                        :
                                        null
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    {imageData.selectedFile &&
                                    <Button variant="contained" color="primary" type={"button"} className={`${classes.btn} ${classes.loader}`}
                                        onClick={()=>addImage()}>
                                        <InsertPhotoOutlined /> {lang.add}
                                    </Button>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.contactData}>
                            <h4 className={`${classes.h4}`}>
                                <PermMedia />&nbsp;{lang.images}
                            </h4>
                            <hr/>
                            <div>
                                { slider.length > 0 &&
                                    slider.map(item => (
                                        <div className={`${classes.selectedImage} ${classes.delItem}`} key={item.name}>
                                            <figure className={classes.selectedFile}>
                                                <img src={item.url} alt="slide"/>
                                            </figure>
                                            <span onClick={() => deleteImage(item.name)}>
                                                <Clear/>
                                            </span>
                                        </div>
                                    ))
                                }
                                {images.length > 0 &&
                                    images.map(item => (
                                        <div className={`${classes.selectedImage} ${classes.delItem}`} key={item.name}>
                                            <figure className={classes.selectedFile}>
                                                <img src={item.selectedFile} alt="slide"/>
                                            </figure>
                                            <span onClick={() => deleteImageFromStore(item.name)}>
                                                <Clear/>
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </form>
        </div>
    );

}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeHomeState: (data) => {dispatch(change_page_data(data))},
        addUpdateNetworksLinks: (data) => {dispatch(add_update_networks_links(data))},
        addUpdateSliderImage: (data) => {dispatch(add_update_slider_image(data))},
        setNewImage: (data) => {dispatch(set_image(data))},
        updateImagesData: (data) => {dispatch(update_images_data(data))},
        removeImage: (data) => {dispatch(remove_image(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SliderImages);