import {CHANGE_PAGE_DATA} from '../constants'

const initState = {
    site: {},
}

const homeReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case CHANGE_PAGE_DATA:
            return {
                ...state,
                site: {...payload}
            }
        default:
            return state
    }
}

export default homeReducer