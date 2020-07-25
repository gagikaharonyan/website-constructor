import {CHANGE_PAGE_DATA} from '../constants'

const initState = {
    currentAction: "",
    currentSetting: "",
    site: {
        navBar: {
            pages: [
                {name: 'home'},
                {name: 'posts'},
                {name: 'events'},
            ],
            backgroundColor: "",
            color: "",
            fontFamily: "",
        },
        contactUs: [
            {type: 'EMAIL', text: ''},
            {type: 'PHONE_NUMBER', text: ''},
            {type: 'LOCATION', text: ''},
        ],
    },
};

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