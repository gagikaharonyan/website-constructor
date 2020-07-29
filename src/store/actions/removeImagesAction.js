import {REMOVE_IMAGE,SET_REMOVE_IMAGES} from '../constants';

export const remove_image = (data) => {
    return {
        type: REMOVE_IMAGE, payload : data
    }
};

export const set_remove_images = (data) => {
    return {
        type: SET_REMOVE_IMAGES, payload : data
    }
};