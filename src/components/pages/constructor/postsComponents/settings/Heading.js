import React, {useEffect, useState} from "react";
import {Button, Input} from '@material-ui/core';
import {connect, useSelector} from "react-redux";
import {change_page_data} from "../../../../../store/actions/homeAction";
import {notification} from "antd";

function Heading(props) {
    const {lang} = props,
        [heading, setHeading] = useState(""),
        {home} = useSelector(state => state);

    useEffect(() => {
        let {heading} = home.site.post;
        if (heading.trim().length > 0) {
            setHeading(heading)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handelSetHeading = (e) => {
        e.preventDefault()
        setHeading(e.target.value)
    }

    const sendHeading = (e) => {
        e.preventDefault()

        if (!heading.trim().length) {
            notification.warning({
                message: lang.notification,
                description: lang.placeholderHeading,
                placement: "topRight",
            });
        }

        props.changeHomeState({
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        heading
                    }
                }
            }
        );
    }

    return (
        <div>
            <Input value={heading} onChange={handelSetHeading} placeholder={lang.placeholderHeading}/>
            <Button variant="contained" color="primary" style={{marginLeft: "10px"}} type={"button"}
                    onClick={sendHeading}>
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


export default connect(mapStateToProps, mapDispatchToProps)(Heading)