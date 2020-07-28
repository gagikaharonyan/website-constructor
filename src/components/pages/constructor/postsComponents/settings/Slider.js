import React, {useState, useEffect} from "react";
import {Upload, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Button} from "@material-ui/core";
import {connect, useSelector} from "react-redux";
import {change_page_data} from "../../../../../store/actions/homeAction";
import {notification} from 'antd';


const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


function Slider(props) {
    const {lang} = props,
          [previewVisible, setPreviewVisible] = useState(false),
          [previewImage, setPreviewImage] = useState(""),
          [previewTitle, setPreviewTitle] = useState(""),
          [fileList, setFileList] = useState([]),
          {home} = useSelector(state => state);

    useEffect(() => {
        let {slide} = home.site.post;
        if (slide.length > 0) {
            setFileList([...slide])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    const handleChange = ({fileList}) => setFileList(fileList);

    const handleCancel = () => setPreviewVisible(false);

    const setSliderImages = (ev) => {
        ev.preventDefault();
        if (!fileList.length) {
            notification.warning({
                message: lang.notification,
                description: lang.notification_postPage_apply_slider,
                placement: "topRight",
            });
        }

        props.changeHomeState({
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        slide: [...fileList],
                    }
                }
            }
        );
    }


    return (
        <div className="clearfix">
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Button variant="contained" color="primary" type={"button"} onClick={setSliderImages}>
                {lang.apply}
            </Button>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
            <br/>

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
        changeHomeState: (data) => {
            dispatch(change_page_data(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slider)