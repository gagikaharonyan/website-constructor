import React, {useEffect} from "react";
import {Table} from 'antd'
import {change_page_data, getAllListPosts} from "../../../../../store/actions/homeAction";
import {connect, useSelector} from "react-redux";
import columns from '../column/column'
import Firebase from "../../../../../Firebase/Firebase"

function ListPosts(props) {
    const {home} = useSelector(state => state);

    const handelEditPost = (entry) => {
        props.changeHomeState({
            ...home,
            site: {
                ...home.site,
                post: {
                    ...home.site.post,
                    listPosts: {
                        ...home.site.post.listPosts,
                        entry
                    }
                }
            }
        })
    }

    const handelDeletePost = (id) => {
        Firebase.post(id).remove()
        props.getAllListPosts()
    }

    useEffect(() => {
        props.changeHomeState({
            ...home,
            site: {
                ...home.site,
                post: {
                    ...home.site.post,
                    listPosts: {
                        ...home.site.post.listPosts,
                        loading: true,
                    }
                }
            }
        })
        props.getAllListPosts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const column = (typeof (columns) === 'function') ? columns(props, handelEditPost, handelDeletePost) : columns;

    return (
        <div>
            <Table loading={{spinning: home.site.post.listPosts.loading, indicator: (<div className="utils__spin"/>)}}
                   key={'p2'} className="ant-table-content"
                   bordered dataSource={home.site.post.listPosts.allList}
                   columns={column}/>
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPosts);