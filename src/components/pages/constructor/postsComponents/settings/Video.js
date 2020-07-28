import React, {useEffect, useState} from "react";
import {Button, Input} from "@material-ui/core";
import {change_page_data} from "../../../../../store/actions/homeAction";
import {connect, useSelector} from "react-redux";
import {notification} from "antd";

function Video(props) {
    const {lang} = props,
          [url, setUrl] = useState(""),
          {home} = useSelector(state => state);

    useEffect(() => {
        let {videoUrl} = home.site.post;
        if (videoUrl.trim().length > 0) {
            setUrl(videoUrl)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handelChangeUrl = (e) => {
        e.preventDefault();
        setUrl(e.target.value)
    }

    const isUrlValid = (userInput) => {
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(userInput);
    }

    const handelOnSend = (e) => {
        e.preventDefault();

        if (!isUrlValid(url)) {
            return notification.warning({
                message: lang.notification,
                description: lang.validation_url_video,
                placement: "topRight",
            });
        }

        if (!url.trim().length) {
            notification.warning({
                message: lang.notification,
                description: lang.placeholderVideo,
                placement: "topRight",
            });
        }

        props.changeHomeState({
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        videoUrl: url
                    }
                }
            }
        );
    }

    return (
        <>
            <Input value={url} onChange={handelChangeUrl} placeholder={lang.placeholderVideo}/>
            <Button onClick={handelOnSend} variant="contained" color="primary" style={{marginLeft: "10px"}}
                    type={"button"}>
                {lang.apply}
            </Button>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Video)