import React, {useEffect, useState} from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import {Button} from "@material-ui/core";
import {change_page_data} from "../../../../../store/actions/homeAction";
import {connect, useSelector} from "react-redux";
import {notification} from "antd";

function Paragraph(props) {
    const [paragraph, setParagraph] = useState(""),
        {lang} = props,
        {home} = useSelector(state => state);

    useEffect(() => {
        let {paragraph} = home.site.post;
        if (paragraph.trim().length > 0) {
            setParagraph(paragraph)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handelSetParagraph = (ev) => {
        ev.preventDefault();
        if (!paragraph.trim().length) {
            notification.warning({
                message: lang.notification,
                description: lang.notification_postPage_apply_paragraph,
                placement: "topRight",
            });
        }

        props.changeHomeState({
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        paragraph: paragraph,
                    }
                }
            }
        );
    }

    return (
        <div>
            <CKEditor
                config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'tableColumn', 'tableRow', '|', 'undo', 'redo'],
                }}
                editor={ClassicEditor}
                data={paragraph}
                onChange={(event, editor) => setParagraph(editor.getData())}
            />
            <br/>
            <Button variant="contained" color="primary" type={"button"} onClick={handelSetParagraph} n>
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

export default connect(mapStateToProps, mapDispatchToProps)(Paragraph)