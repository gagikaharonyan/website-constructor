import {
    CHANGE_PAGE_DATA,
    CHANGE_NAV_BAR_DATA,
    CHANGE_NAV_BAR_SETTINGS,
    CHANGE_CURRENT_SETTINGS,
    CHANGE_EVENTS_STATE,
    CHANGE_CONTACT_US_STATE,
    ADD_CONTACT_DATA,
    ADD_UPDATE_NETWORKS_LINKS,
    ADD_UPDATE_SLIDER_IMAGE,
    GET_DATA_POSTS,
    GET_CATEGORIES,
    LOADING_CATEGORIES
} from '../constants';

const initState = {
    currentAction: "",
    currentSetting: "",
    site: {
        navBar: {
            pages: [
                {name: 'home'},
                {name: 'posts'},
                {name: 'events'},
            ],
            backgroundColor: "",
            color: "",
            fontFamily: "",
            networks: {},
            slider: [],
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
        },
        contactUs: [],
        events: {},
        categories: {
            data: [],
            isLoading: false
        }
    },
};

const homeReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case CHANGE_PAGE_DATA:
            return {
                ...state,
                ...payload
            }
        case CHANGE_NAV_BAR_DATA:
            return {
                ...state, site: {
                    ...state.site, navBar: {...payload}
                }
            }
        case CHANGE_NAV_BAR_SETTINGS:
            return {
                ...state, site: {
                    ...state.site, navBar: {
                        ...state.site.navBar,
                        [payload.name]: payload.data
                    }
                }
            }
        case CHANGE_CURRENT_SETTINGS:
            return {
                ...state, currentSetting: payload
            }
        case CHANGE_EVENTS_STATE:
            return {
                ...state, site: {
                    ...state.site,
                    events: {...payload}
                }
            }
        case CHANGE_CONTACT_US_STATE:
            return {
                ...state, site: {
                    ...state.site,
                    contactUs: [...payload]
                }
            }
        case ADD_CONTACT_DATA:
            return {
                ...state, site: {
                    ...state.site,
                    contactUs: [...state.site.contactUs, payload]
                }
            }
        case ADD_UPDATE_NETWORKS_LINKS:
            return {
                ...state, site: {
                    ...state.site, navBar: {
                        ...state.site.navBar,
                        networks: {...payload}
                    }
                }
            }
        case ADD_UPDATE_SLIDER_IMAGE:
            return {
                ...state, site: {
                    ...state.site, navBar: {
                        ...state.site.navBar,
                        slider: [...payload]
                    }
                }
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
        case GET_CATEGORIES:
            return {
                ...state, site: {
                    ...state.site,
                    categories: {
                        ...state.site.categories,
                        data: [...payload]
                    }
                }
            }
        case LOADING_CATEGORIES:
            return {
                ...state, site: {
                    ...state.site,
                    categories: {
                        ...state.site.categories,
                        isLoading: payload
                    }
                }
            }
        default:
            return state
    }
}

export default homeReducer;