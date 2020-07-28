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

export const change_page_data = (data) => {
    return {
        type: CHANGE_PAGE_DATA, payload : data
    }
};

export const change_nav_bar_data = (data) => {
    return {
        type: CHANGE_NAV_BAR_DATA, payload : data
    }
};

export const change_nav_bar_settings = (name, data) => {
    return {
        type: CHANGE_NAV_BAR_SETTINGS, payload : {name, data}
    }
};

export const change_current_settings = (data) => {
    return {
        type: CHANGE_CURRENT_SETTINGS, payload : data
    }
};

export const change_events_state = (data) => {
    return {
        type: CHANGE_EVENTS_STATE, payload : data
    }
};

export const change_contact_us_state = (data) => {
    return {
        type: CHANGE_CONTACT_US_STATE, payload : data
    }
};

export const add_contact_data = (data) => {
    return {
        type: ADD_CONTACT_DATA, payload : data
    }
};

export const add_update_networks_links = (data) => {
    return {
        type: ADD_UPDATE_NETWORKS_LINKS, payload : data
    }
};

export const add_update_slider_image = (data) => {
    return {
        type: ADD_UPDATE_SLIDER_IMAGE, payload : data
    }
};