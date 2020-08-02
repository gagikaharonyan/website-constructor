import {SET_IMAGE,UPDATE_IMAGES_DATA} from '../constants'

const initState = [];

const imagesReducer = (state= initState, {type,payload}) => {
    switch (type) {
        case SET_IMAGE:
            return [
                ...state, {...payload}
            ]
        case UPDATE_IMAGES_DATA:
            return [
                ...payload
            ]
        default:
            return state
    }
}

export default imagesReducer;