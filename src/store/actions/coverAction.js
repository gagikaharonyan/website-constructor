import {SET_COVER_IMAGE, RESET_COVER_DATA} from '../constants';

export const set_cover_image = (data) => {
    return {
        type: SET_COVER_IMAGE, payload : data
    }
};

export const reset_cover_data = (data) => {
    return {
        type: RESET_COVER_DATA, payload : data
    }
};