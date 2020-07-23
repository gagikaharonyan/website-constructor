import {CHANGE_ADMIN_STATUS} from '../constants'

export const change_admin_status = (data) => {
    return {
        type: CHANGE_ADMIN_STATUS, payload : data
    }
}