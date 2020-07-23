import {CHANGE_ADMIN_STATUS} from '../constants'

const initState = {
    isLogged: false,
}

const homeReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case CHANGE_ADMIN_STATUS:
            return {
                ...state, ...payload
            }
        default:
            return state
    }
}

export default homeReducer