import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Button, CircularProgress, Grid, Input, InputLabel} from "@material-ui/core";
import {connect, useSelector} from "react-redux";
import Firebase from "../../../../../Firebase/Firebase"
import {notification, Upload} from "antd";
import {change_page_data, getAllListPosts} from "../../../../../store/actions/homeAction";


function PreviewItemList(props) {
    const {home} = useSelector(state => state);
    const [fileListSlider, setFileListSlider] = useState([]);
    const [fileListPhoto, setFileListPhoto] = useState([]);
    const entry = {...home.site.post.listPosts.entry}
    const [isLoadingBtnSave,setIsLoadingBtnSave] = useState(false);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [home.site.post.listPosts.entry])

    const getUrlsSliders = (data) => {
        return data.map((el) => el.url)
    }

    const updatePosts = (fields) => {
        setIsLoadingBtnSave(true)
        if (fileListSlider.length > 0) {
            let sendData = {};
            let newUploadSliders = [...fileListSlider].filter((el) => el.type);
            let oldUploadSliders = [...fileListSlider].filter((el) => !el.type);
            let newUploadPhoto = [...fileListPhoto].filter((el) => el.type);
            let oldUploadPhoto = [...fileListPhoto].filter((el) => !el.type);

            pictureUpload(newUploadSliders).then((newImgUrls) => {
                pictureUpload(newUploadPhoto).then((images) => {
                    let imgUrls = [...newImgUrls],
                        imgUrl = [...images];

                    if (oldUploadSliders.length > 0) {
                        let urlSliders = getUrlsSliders(oldUploadSliders);
                        imgUrls.push(...urlSliders)
                    }

                    if (oldUploadPhoto.length > 0) {
                        let urlPhotos = getUrlsSliders(oldUploadPhoto);
                        imgUrl.push(...urlPhotos)
                    }

                    sendData.SLIDE = {type: 'SLIDE', imgUrls};
                    sendData.PHOTO = {type: 'PHOTO', imgUrl};
                    sendData.HEADING = {type: 'HEADING', text: fields.HEADING};
                    sendData.PARAGRAPH = {type: 'PARAGRAPH', text: fields.PARAGRAPH};
                    sendData.VIDEO = {type: 'VIDEO', text: fields.VIDEO};
                    sendData.QUOTE = {type: 'QUOTE', text: fields.QUOTE};
                    sendData.updated_at = {type: 'updated_at', time: new Date().getTime()};

                    Firebase.post(entry.id).update(sendData).then((res) => {
                        setIsLoadingBtnSave(false)
                        props.getAllListPosts();
                        onCancelEdit()
                    }).catch((err) => setIsLoadingBtnSave(false))
                })
            })
        } else {
            notification.warning({
                message: "Notification",
                description: `Please Upload Slider Image(s)`,
                placement: "topRight",
            });
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
                            VIDEO: entry.VIDEO
                        }}
                        validationSchema={
                            Yup.object({
                                HEADING: Yup.string().required('Heading is required'),
                                PARAGRAPH: Yup.string().required('Paragraph is required'),
                                QUOTE: Yup.string().required('Quote is required'),
                                VIDEO: Yup.string()
                                    .matches(
                                        /^((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                        'Enter correct url!'
                                    )
                                    .required('Please enter website')
                            })
                        }
                        onSubmit={fields => {
                            updatePosts(fields)
                        }}
                    >

                        {
                            ({errors, status, touched, values, setFieldValue}) => (
                                <Form>
                                    <br/><br/>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <Field
                                                    name="HEADING"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                                   placeholder="Heading"/>
                                                            {touched[field.name] &&
                                                            errors[field.name] && <div style={{color: "red"}}
                                                                                       className="error">{errors[field.name]}</div>}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Field
                                                    name="QUOTE"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                                   placeholder="Quote"/>
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
                                            <Grid item xs={12}>
                                                <Field
                                                    name="VIDEO"
                                                    render={({field, form: {touched, errors}}) => (
                                                        <div>
                                                            <Input fullWidth {...field} type="text"
                                                                   placeholder="Video Url"/>
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

                                        <Grid item xs={6}>
                                            <InputLabel>Slider</InputLabel>
                                            <br/>
                                            <Upload
                                                key={"y"}
                                                listType="picture-card"
                                                fileList={fileListSlider}
                                                onChange={handleChangeUploadSlide}
                                            >
                                                {fileListSlider.length < 8 && '+ Upload'}
                                            </Upload>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <InputLabel>Images</InputLabel>
                                            <br/>
                                            <div className="clearfix">
                                                <Upload
                                                    listType="picture-card"
                                                    fileList={fileListPhoto}
                                                    onChange={handleChangeUploadPhoto}
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
                                            data={entry.PARAGRAPH}
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
                                                    Save
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewItemList)