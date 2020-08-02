import {REMOVE_IMAGE, SET_REMOVE_IMAGES} from '../constants'

const initState = [];

const removeImagesReducer = (state= initState, {type,payload}) => {
    switch (type) {
        case REMOVE_IMAGE:
            return [
                ...state, {...payload}
            ]
        case SET_REMOVE_IMAGES:
            return [
                ...payload
            ]
        default:
            return state
    }
}

export default removeImagesReducer;