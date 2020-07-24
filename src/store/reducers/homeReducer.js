import {CHANGE_PAGE_DATA} from '../constants'

const initState = {
    currentAction: "",
    currentSetting: "",
    site: {
        navBar: {
            pages: [],
            backgroundColor: "",
            color: "",
            fontFamily: "",
        },
    },
}

const homeReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case CHANGE_PAGE_DATA:
            return {
                ...state,
                ...payload
            }
        default:
            return state
    }
}

export default homeReducer