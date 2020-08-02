import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Button, CircularProgress, Grid, Input} from "@material-ui/core";
import {Upload, Modal, notification} from "antd";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function AboutUsSettings(props) {
    const [fileList, setFileList] = useState([]),
          [previewVisible, setPreviewVisible] = useState(false),
          [previewImage, setPreviewImage] = useState(""),
          {lang, data, isLoading} = props;


    useEffect(() => {
        if (data.avatar) {
            let avatar = data.avatar,
                updateData = {
                    url: avatar,
                    uid: '-1',
                };
            setFileList([{
                ...updateData
            }])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChange = ({fileList: newFileList}) => {
        setFileList(newFileList);
    };

    const onPreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    };

    const handleCancel = () => {
        setPreviewVisible(false)
    }

    const submitData = (fields) => {
        if (fileList.length > 0) {
            let data = {...fields, avatar: fileList}
            props.sendData(data)
        } else {
            notification.warning({
                message: lang.notification,
                description: `Please Upload avatar`,
                placement: "bottomRight",
            });
        }

    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{
                    description: data.description,
                    title: data.title,
                }}
                validationSchema={
                    Yup.object({
                        description: Yup.string().required('Heading is required'),
                        title: Yup.string().required('Paragraph is required'),
                    })
                }
                onSubmit={fields => {
                    submitData(fields)
                }}
            >

                {
                    ({errors, status, touched, values, setFieldValue}) => (
                        <Form>
                            <br/><br/>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={2}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList}
                                            onChange={onChange}
                                            onPreview={onPreview}
                                        >
                                            {fileList.length < 1 && '+ Upload'}
                                        </Upload>
                                        <Modal
                                            visible={previewVisible}
                                            title={null}
                                            footer={null}
                                            onCancel={handleCancel}
                                        >
                                            <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                        </Modal>

                                    </Grid>
                                    <Grid item xs={10}>
                                        <Field
                                            name="title"
                                            render={({field, form: {touched, errors}}) => (
                                                <div>
                                                    <Input fullWidth {...field} type="text"
                                                           placeholder="Title"/>
                                                    {touched[field.title] &&
                                                    errors[field.title] && <div style={{color: "red"}}
                                                                                className="error">{errors[field.title]}</div>}
                                                </div>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <br/>
                            <div style={{marginTop: "5px"}} className="form-group col-6">
                                <CKEditor
                                    config={{
                                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'tableColumn', 'tableRow', '|', 'undo', 'redo'],
                                    }}
                                    editor={ClassicEditor}
                                    data={data.description}
                                    onChange={(event, editor) => setFieldValue('description', editor.getData())}
                                />
                                <ErrorMessage style={{color: "red"}} name="description" component="div"
                                              className="invalid-feedback"/>
                            </div>

                            <br/>
                            <div style={{marginTop: "5px", display: 'flex'}} className="form-group">
                                <div style={{'margin': 'auto'}}>
                                    {isLoading ? <CircularProgress size={14}/> :
                                        <Button type="submit" variant="contained" color="primary">
                                            Save
                                        </Button>}

                                </div>
                            </div>
                        </Form>
                    )

                }
            </Formik>
        </div>
    )
}

export default AboutUsSettings