import React, {useEffect, useState} from "react";
import {Button, Input} from "@material-ui/core";
import {connect, useSelector} from "react-redux";
import {change_page_data} from "../../../../../store/actions/homeAction";
import {notification} from "antd";

function Quote(props) {
    const [quote, setQuote] = useState(""),
          {lang} = props,
          {home} = useSelector(state => state);

    useEffect(() => {
        if (home.site.post.quote.trim().length > 0) {
            setQuote(home.site.post.quote)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handelSetQuote = (e) => {
        e.preventDefault();
        setQuote(e.target.value)
    }

    const handelApplyQuote = (e) => {
        e.preventDefault();

        if (!quote.trim().length) {
            notification.warning({
                message: lang.notification,
                description: lang.no_preview_quote,
                placement: "topRight",
            });
        }

        props.changeHomeState({
                ...home,
                site: {
                    ...home.site,
                    post: {
                        ...home.site.post,
                        quote
                    }
                }
            }
        );
    }

    return (
        <div>
            <Input value={quote} onChange={handelSetQuote} placeholder={lang.placeholderQuote}/>
            <Button variant="contained" color="primary" style={{marginLeft: "10px"}} type={"button"}
                    onClick={handelApplyQuote}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Quote)

