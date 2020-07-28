import React, {useEffect, useState} from "react";
import {notification, Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {Button} from "@material-ui/core";
import {connect, useSelector} from "react-redux";
import {change_page_data} from "../../../../../store/actions/homeAction";

function Photo(props) {
    const [fileList, setFileList] = useState([]),
          {lang} = props,
          {home} = useSelector(state => state);

    useEffect(() => {
        let {photo} = home.site.post;
        if (photo.length > 0) {
            setFileList([...photo])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChange = ({fileList: newFileList}) => {
        setFileList(newFileList);
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

    const sendImage = (ev) => {
        ev.preventDefault();

        if (!fileList.length) {
            notification.warning({
                message: lang.notification,
                description: lang.notification_postPage_apply_photo,
                placement: "topRight",
            });
        }

        props.changeHomeState({
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        photo: [...fileList]
                    }
                }
            }
        );
    }


    return (
        <div style={{display: "grid", justifyContent: "center"}}>
            <ImgCrop rotate>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                >
                    {fileList.length < 1 && '+ Upload'}
                </Upload>
            </ImgCrop>
            <br/>
            <Button variant="contained" color="primary" type={"button"} onClick={sendImage}>
                {lang.apply}
            </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Photo)