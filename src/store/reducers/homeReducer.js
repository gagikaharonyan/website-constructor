import {CHANGE_PAGE_DATA,GET_DATA_POSTS} from '../constants'

const initState = {
    currentAction: "",
    currentSetting: "",
    site: {
        navBar: {
            pages: [],
            backgroundColor: "",
            color: "",
            fontFamily: "",
        },
        post: {
            slide: [],
            heading: "",
            photo: [],
            paragraph: "",
            videoUrl: "",
            quote: "",
            listPosts: {
                allList: [],
                loading: false,
                entry: {},
            }
        }
    },
}

const homeReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case CHANGE_PAGE_DATA:
            return {
                ...state,
                ...payload
            }
        case GET_DATA_POSTS:
            return {
                ...state,
                site: {
                    ...state.site,
                    post: {
                        ...state.site.post,
                        listPosts: {
                            ...state.site.post.listPosts,
                            allList: [...payload],
                            loading: false,
                        }
                    }
                }
            }
        default:
            return state
    }
}

export default homeReducer