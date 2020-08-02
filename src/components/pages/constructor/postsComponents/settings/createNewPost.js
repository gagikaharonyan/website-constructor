import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Button, CircularProgress, Grid, Input, InputLabel} from "@material-ui/core";
import {notification, Upload} from "antd";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from '@material-ui/core/Select';
import {makeStyles} from "@material-ui/core/styles";
import {change_page_data, fetchCategories} from "../../../../../store/actions/homeAction";
import {connect, useSelector} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";

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

function CreateNewPost(props) {
    const [fileListSlider, setFileListSlider] = useState([]),
        [filePostImage, setFilePostImage] = useState([]),
        [filePhoto, setFilePhoto] = useState([]),
        classes = useStyles(),
        {home} = useSelector(state => state),
        {site: {categories: {data}}} = home;

    useEffect(() => {
        props.getListCategory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChange = ({fileList: newFileList}, nameUploadFile) => {
        if (nameUploadFile === "slider") {
            setFileListSlider(newFileList);
        } else if (nameUploadFile === "image") {
            setFilePostImage(newFileList)
        } else if (nameUploadFile === "photo") {
            setFilePhoto(newFileList)
        }

    };

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


    const createANewPost = (fields, resetForm) => {
        if (fileListSlider.length === 0) {

            notification.warning({
                message: `Notification`,
                description: 'Please add photos for the slide',
                placement: "bottomRight",
            });
        } else if (filePostImage.length === 0) {
            notification.warning({
                message: `Notification`,
                description: 'Please add post image',
                placement: "bottomRight",
            });
        } else if (filePhoto.length === 0) {
            notification.warning({
                message: `Notification`,
                description: 'Please add post Photo',
                placement: "bottomRight",
            });
        } else {
            let post = {...fields};
            post.sliderImage = [...fileListSlider];
            post.postImage = [...filePostImage];
            post.postPhoto = [...filePhoto];

            props.sendData(post)

            resetForm()
            setFileListSlider([])
            setFilePhoto([])
            setFilePostImage([])
        }
    }

    return (
        <>

            <Formik
                enableReinitialize
                initialValues={{
                    HEADING: "",
                    PARAGRAPH: "",
                    QUOTE: "",
                    VIDEO: "",
                    TITLE: "",
                    CATEGORY: "Sport"

                }}
                validationSchema={
                    Yup.object({
                        HEADING: Yup.string().required('Heading is required'),
                        TITLE: Yup.string().required('Title is required'),
                        CATEGORY: Yup.string().required('Category is required'),
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
                onSubmit={(fields, {setSubmitting, setErrors, setStatus, resetForm}) => {
                    createANewPost(fields, resetForm)
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
                                        <InputLabel id="demo-simple-select-label">Title</InputLabel>
                                        <Field
                                            name="TITLE"
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
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        fullWidth
                                                        name="category"
                                                        value={values.category}
                                                        onChange={(e) => setFieldValue("CATEGORY", e.target.value)}
                                                    >
                                                        {data.map((el) => <MenuItem key={el.id}
                                                                                    value={el.category}>{el.category}</MenuItem>)}
                                                    </Select>
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
                                        onChange={(file) => onChange(file, "slider")}
                                        onPreview={onPreview}
                                    >
                                        {fileListSlider.length < 8 && '+ Upload'}
                                    </Upload>
                                </Grid>
                                <Grid className={classes.borderBlock} item xs={4}>
                                    <InputLabel id="demo-simple-select-label">Images</InputLabel>
                                    <br/>
                                    <div className="clearfix">
                                        <Upload
                                            listType="picture-card"
                                            fileList={filePostImage}
                                            onChange={(file) => onChange(file, "image")}
                                            onPreview={onPreview}
                                        >
                                            {filePostImage.length < 1 && '+ Upload'}
                                        </Upload>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <InputLabel id="demo-simple-select-label">Photo</InputLabel>
                                    <br/>
                                    <div className="clearfix">
                                        <Upload
                                            listType="picture-card"
                                            fileList={filePhoto}
                                            onChange={(file) => onChange(file, "photo")}
                                            onPreview={onPreview}
                                        >
                                            {filePhoto.length < 1 && '+ Upload'}
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
                                    {props.isLoading ? <CircularProgress size={14}/> :
                                        <Button type="submit" variant="contained" color="primary">
                                            Save
                                        </Button>}
                                </div>
                            </div>
                        </Form>
                    )

                }
            </Formik>
        </>
    )

}


const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeHomeState: (data) => {
            dispatch(change_page_data(data))
        },
        getListCategory: () => {
            dispatch(fetchCategories())
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateNewPost)