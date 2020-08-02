import {SET_COVER_IMAGE, RESET_COVER_DATA} from '../constants'

const initState = {};

const coverReducer = (state= initState, {type,payload}) => {
    switch (type) {
        case SET_COVER_IMAGE:
            return {...payload}
        case RESET_COVER_DATA:
            return {...payload}
        default:
            return state
    }
}

export default coverReducer;