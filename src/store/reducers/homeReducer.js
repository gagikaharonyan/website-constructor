import {
    CHANGE_PAGE_DATA,
    CHANGE_NAV_BAR_DATA,
    CHANGE_NAV_BAR_SETTINGS,
    CHANGE_CURRENT_SETTINGS,
    CHANGE_EVENTS_STATE,
    CHANGE_CONTACT_US_STATE,
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
        },
        contactUs: [
            {type: 'EMAIL', text: ''},
            {type: 'PHONE_NUMBER', text: ''},
            {type: 'LOCATION', text: ''},
        ],
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
        default:
            return state
    }
}

export default homeReducer;