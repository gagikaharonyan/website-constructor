import {CHANGE_PAGE_DATA} from '../constants'

export const change_page_data = (data) => {
    return {
        type: CHANGE_PAGE_DATA, payload : data
    }
}