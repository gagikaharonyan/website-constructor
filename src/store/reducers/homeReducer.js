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
        contactUs: [],
        events: {},
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
        default:
            return state
    }
}

export default homeReducer;