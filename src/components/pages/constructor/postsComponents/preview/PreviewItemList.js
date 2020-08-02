import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Button, CircularProgress, Grid, Input, InputLabel} from "@material-ui/core";
import {connect, useSelector} from "react-redux";
import Firebase from "../../../../../Firebase/Firebase"
import {notification, Upload} from "antd";
import {change_page_data, fetchCategories, getAllListPosts} from "../../../../../store/actions/homeAction";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    alert: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    borderBlock: {
        borderRight: "2px solid #949494"
    },
    h1: {
        color: '#000',
        fontSize: 30,
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
    },
    h2: {
        fontSize: 20,
        textAlign: 'left',
    },
    btnSave: {
        width: 300,
    },
}));

function PreviewItemList(props) {
    const {home} = useSelector(state => state);
    const [fileListSlider, setFileListSlider] = useState([]);
    const [fileListPhoto, setFileListPhoto] = useState([]);
    const [fileListImage, setFileListImage] = useState([]);
    const entry = {...home.site.post.listPosts.entry}
    const [isLoadingBtnSave,setIsLoadingBtnSave] = useState(false);
    const {site: {categories: {data}}} = home;
    const classes = useStyles();

    const generateSlideAndPhoto = (data) => {
        if (data !== undefined && data.length > 0) {
            return data.map((url, index) => {
                return {
                    uid: index,
                    name: 'Post Image',
                    status: 'done',
                    url
                }
            });
        } else {
            return []
        }
    }

    const onCancelEdit = () => {
        props.changeHomeState(
            {
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        listPosts: {
                            ...home.site.post.listPosts,
                            entry: {}
                        }
                    }
                }
            }
        )
    }

    const handleChangeUploadPhoto = ({fileList}) => setFileListPhoto(fileList);
    const handleChangeUploadSlide = ({fileList}) => setFileListSlider(fileList);
    const handleChangeUploadImage = ({fileList}) => setFileListImage(fileList);

    const saveImageAsStorage = (pic) => {
        return new Promise((resolve, reject) => {
            Firebase.storage.ref("storage/images/posts").child(`${new Date().getTime()}`).put(pic.originFileObj).then((snap) => {
                snap.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            });
        })
    }

    const pictureUpload = (picData) => {
        let urls = [];
        if (picData.length > 0) {
            urls = picData.map((pic) => {
                return saveImageAsStorage(pic);
            })
        }

        return Promise.all(urls)
    }

    useEffect(() => {
        setFileListSlider(generateSlideAndPhoto(entry.SLIDE))
        setFileListPhoto(generateSlideAndPhoto(entry.PHOTO))
        setFileListImage(generateSlideAndPhoto([entry.imgUrl]))
        props.getListCategory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [home.site.post.listPosts.entry])

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const getUrlsSliders = (data) => {
        return data.map((el) => el.url)
    }

    const currentDate = () => {
        let today = new Date(),
            dd = String(today.getDate()).padStart(2, '0'),
            mm = String(today.getMonth() + 1).padStart(2, '0'),
            yyyy = today.getFullYear();

        return  mm + '/' + dd + '/' + yyyy;
    }

    const youtubeParser = (url) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }

    const updatePosts = (fields) => {
        setIsLoadingBtnSave(true)
        if (fileListSlider.length === 0) {
            setIsLoadingBtnSave(false)
            notification.warning({
                message: "Notification",
                description: `Please Upload Slider Image(s)`,
                placement: "topRight",
            });
        } else if (fileListPhoto.length === 0) {
            setIsLoadingBtnSave(false)
            notification.warning({
                message: "Notification",
                description: `Please Upload photo`,
                placement: "topRight",
            });
        } else if (fileListImage.length === 0) {
            setIsLoadingBtnSave(false)
            notification.warning({
                message: "Notification",
                description: `Please Upload image`,
                placement: "topRight",
            });
        } else {

            let newUploadSliders = [...fileListSlider].filter((el) => el.type),
                oldUploadSliders = [...fileListSlider].filter((el) => !el.type),
                newUploadImage = [...fileListImage].filter((el) => el.type),
                oldUploadImage = [...fileListImage].filter((el) => !el.type),
                newUploadPhoto = [...fileListPhoto].filter((el) => el.type),
                oldUploadPhoto = [...fileListPhoto].filter((el) => !el.type);

            pictureUpload(newUploadSliders).then((sliderImgUrls) => {
                pictureUpload(newUploadImage).then((imagePostUrl) => {
                    pictureUpload(newUploadPhoto).then((photoUrl) => {
                        let imgUrls = [...sliderImgUrls],
                            imgUrl = [...imagePostUrl],
                            sendData = {},
                            postImgUrl = photoUrl[0];


                        if (oldUploadSliders.length > 0) {
                            let urlSliders = getUrlsSliders(oldUploadSliders);
                            imgUrls.push(...urlSliders)
                        }

                        if (oldUploadPhoto.length > 0) {
                            let urlPhotos = getUrlsSliders(oldUploadPhoto);
                            imgUrl.push(...urlPhotos)
                        }

                        if (oldUploadImage.length > 0) {
                            postImgUrl = oldUploadImage[0].url
                        }
                        sendData.imgUrl = postImgUrl;
                        sendData.category = fields.category;
                        sendData.description = fields.description;
                        sendData.title = fields.HEADING;
                        sendData.dateCreated = currentDate();
                        sendData.components = {
                            SLIDE: {type: 'SLIDE', imgUrls},
                            PHOTO: {type: 'PHOTO', imgUrl: [...imgUrl]},
                            HEADING: {type: 'HEADING', text: fields.HEADING},
                            PARAGRAPH: {type: 'PARAGRAPH', text: fields.PARAGRAPH},
                            QUOTE: {type: 'QUOTE', text: fields.QUOTE},
                            VIDEO: {type: 'VIDEO', videoParam: youtubeParser(fields.VIDEO)}
                        };
                        Firebase.post(entry.id).update(sendData).then((res) => {
                            setIsLoadingBtnSave(false)
                            props.getAllListPosts();
                            onCancelEdit()
                        }).catch((err) => setIsLoadingBtnSave(false))
                    })
                })
            })
        }
    }

    return (
        <div>
            {
                !entry.HEADING ? null :

                    <Formik
                        enableReinitialize
                        initialValues={{
                            HEADING: entry.HEADING,
                            PARAGRAPH: entry.PARAGRAPH,
                            QUOTE: entry.QUOTE,
                            VIDEO: entry.VIDEO,
                            category: entry.category,
                            description: entry.description,
                        }}
                        validationSchema={
                            Yup.object({
                                HEADING: Yup.string().required('Heading is required'),
                                category: Yup.string().required('Category is required'),
                                PARAGRAPH: Yup.string().required('Paragraph is required'),
                                QUOTE: Yup.string().required('Quote is required'),
                                description: Yup.string().required('Description is required'),
                                VIDEO: Yup.string()
                                    .matches(
                                        /^((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                        'Enter correct url!'
                                    )
                                    .required('Please enter website')
                            })
                        }
                        onSubmit={(fields, {setSubmitting, setErrors, setStatus, resetForm}) => {
                            updatePosts(fields)
                        }}
                        onValidationError={errorValues => {
                            console.log('errorValues', errorValues)
                        }}
                    >

                        {
                            ({errors, status, touched, values, setFieldValue}) => (
                                <Form>
                                    <br/><br/>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <InputLabel id="demo-simple-select-label">Heading</InputLabel>
                                                <Field
                                                    name="HEADING"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                            />
                                                            {touched[field.name] &&
                                                            errors[field.name] && <div style={{color: "red"}}
                                                                                       className="error">{errors[field.name]}</div>}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputLabel id="demo-simple-select-label">Description</InputLabel>
                                                <Field
                                                    name="description"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                            />
                                                            {touched[field.name] &&
                                                            errors[field.name] && <div style={{color: "red"}}
                                                                                       className="error">{errors[field.name]}</div>}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>


                                        </Grid>
                                    </Grid>
                                    <br/><br/>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={4}>
                                                <InputLabel id="demo-simple-select-label">Video Url</InputLabel>
                                                <Field
                                                    name="VIDEO"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                            />
                                                            {touched[field.name] &&
                                                            errors[field.name] && <div style={{color: "red"}}
                                                                                       className="error">{errors[field.name]}</div>}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <InputLabel id="demo-simple-select-label">Quote</InputLabel>
                                                <Field
                                                    name="QUOTE"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                            />
                                                            {touched[field.name] &&
                                                            errors[field.name] && <div style={{color: "red"}}
                                                                                       className="error">{errors[field.name]}</div>}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                                <Field
                                                    name="CATEGORY"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Field
                                                                name="CATEGORY"
                                                                render={({field, form: {touched, errors}}) => (
                                                                    <div>
                                                                        <Select
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            fullWidth
                                                                            name="category"
                                                                            value={values.category}
                                                                            onChange={(e) => setFieldValue("category", e.target.value)}
                                                                        >
                                                                            {data.map((el) => <MenuItem
                                                                                value={el.category}>{el.category}</MenuItem>)}
                                                                        </Select>
                                                                        {touched[field.name] &&
                                                                        errors[field.name] &&
                                                                        <div style={{color: "red"}}
                                                                             className="error">{errors[field.name]}</div>}

                                                                    </div>
                                                                )}
                                                            />

                                                            {touched[field.name] &&
                                                            errors[field.name] && <div style={{color: "red"}}
                                                                                       className="error">{errors[field.name]}</div>}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br/>

                                    <br/>
                                    <Grid container spacing={3}>
                                        <Grid className={classes.borderBlock} item xs={4}>
                                            <InputLabel id="demo-simple-select-label">Slider</InputLabel>
                                            <br/>
                                            <Upload
                                                listType="picture-card"
                                                fileList={fileListSlider}
                                                onChange={handleChangeUploadSlide}
                                                onPreview={onPreview}
                                            >
                                                {fileListSlider.length < 8 && '+ Upload'}
                                            </Upload>
                                        </Grid>
                                        <Grid className={classes.borderBlock} item xs={4}>
                                            <InputLabel id="demo-simple-select-label">Cover Photo</InputLabel>
                                            <br/>
                                            <div className="clearfix">
                                                <Upload
                                                    listType="picture-card"
                                                    fileList={fileListImage}
                                                    onChange={handleChangeUploadImage}
                                                    onPreview={onPreview}
                                                >
                                                    {fileListImage.length < 1 && '+ Upload'}
                                                </Upload>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <InputLabel id="demo-simple-select-label">Photo</InputLabel>
                                            <br/>
                                            <div className="clearfix">
                                                <Upload
                                                    listType="picture-card"
                                                    fileList={fileListPhoto}
                                                    onChange={handleChangeUploadPhoto}
                                                    onPreview={onPreview}
                                                >
                                                    {fileListPhoto.length < 1 && '+ Upload'}
                                                </Upload>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    <div style={{marginTop: "5px"}} className="form-group col-6">
                                        <CKEditor
                                            config={{
                                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'tableColumn', 'tableRow', '|', 'undo', 'redo'],
                                            }}
                                            editor={ClassicEditor}
                                            data={values.PARAGRAPH}
                                            onChange={(event, editor) => setFieldValue('PARAGRAPH', editor.getData())}
                                        />
                                        <ErrorMessage style={{color: "red"}} name="PARAGRAPH" component="div"
                                                      className="invalid-feedback"/>
                                    </div>

                                    <br/>
                                    <div style={{marginTop: "5px", display: 'flex'}} className="form-group">
                                        <div style={{'margin': 'auto'}}>
                                            {isLoadingBtnSave ? <CircularProgress size={14}/> :
                                                <Button type="submit" variant="contained" color="primary">
                                                    Save Edit
                                                </Button>}
                                            <Button disabled={isLoadingBtnSave} onClick={onCancelEdit} style={{marginLeft: "5px"}}
                                                    color="danger">Cancel</Button>
                                        </div>
                                    </div>
                                </Form>
                            )

                        }
                    </Formik>
            }


        </div>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllListPosts: (data) => {
            dispatch(getAllListPosts(data))
        },
        changeHomeState: (data) => {
            dispatch(change_page_data(data))
        },
        getListCategory: () => {
            dispatch(fetchCategories())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewItemList)