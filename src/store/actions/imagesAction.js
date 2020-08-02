import {SET_IMAGE,UPDATE_IMAGES_DATA} from '../constants';

export const set_image = (data) => {
    return {
        type: SET_IMAGE, payload : data
    }
};

export const update_images_data = (data) => {
    return {
        type: UPDATE_IMAGES_DATA, payload : data
    }
};