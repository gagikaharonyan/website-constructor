import {
    CHANGE_PAGE_DATA,
    CHANGE_NAV_BAR_DATA,
    CHANGE_NAV_BAR_SETTINGS,
    CHANGE_CURRENT_SETTINGS,
    CHANGE_EVENTS_STATE,
    CHANGE_CONTACT_US_STATE,
    ADD_CONTACT_DATA,
    ADD_UPDATE_NETWORKS_LINKS,
    ADD_UPDATE_SLIDER_IMAGE,
    GET_DATA_POSTS,
    LOADING_CATEGORIES,
    GET_CATEGORIES
} from '../constants';
import Firebase from "../../Firebase/Firebase";
import FirebaseFunctions from "../../Firebase/FirebaseFunctions";
import {notification} from "antd";


export const change_page_data = (data) => {
    return {
        type: CHANGE_PAGE_DATA, payload: data
    }
};

export const change_nav_bar_data = (data) => {
    return {
        type: CHANGE_NAV_BAR_DATA, payload: data
    }
};

export const change_nav_bar_settings = (name, data) => {
    return {
        type: CHANGE_NAV_BAR_SETTINGS, payload: {name, data}
    }
};

export const change_current_settings = (data) => {
    return {
        type: CHANGE_CURRENT_SETTINGS, payload: data
    }
};

export const change_events_state = (data) => {
    return {
        type: CHANGE_EVENTS_STATE, payload: data
    }
};

export const change_contact_us_state = (data) => {
    return {
        type: CHANGE_CONTACT_US_STATE, payload: data
    }
};

export const add_contact_data = (data) => {
    return {
        type: ADD_CONTACT_DATA, payload: data
    }
};

export const add_update_networks_links = (data) => {
    return {
        type: ADD_UPDATE_NETWORKS_LINKS, payload: data
    }
};

export const add_update_slider_image = (data) => {
    return {
        type: ADD_UPDATE_SLIDER_IMAGE, payload: data
    }
}

export const loadingCategories = (boolean) => {
    return {
        type: LOADING_CATEGORIES,
        payload: boolean
    }
}

export const getCategories = (data) => {
    return {
        type: GET_CATEGORIES,
        payload: [...data]
    }
}

export const addCategory = (data) => {
    return (dispatch) => {
        dispatch(loadingCategories(true))

        FirebaseFunctions.addNewData("categories", data.id, {...data})
            .then(response => {
                if (response.result) {
                    dispatch(fetchCategories())
                    notification.success({
                        message: "Notification",
                        description: "you added a new category",
                        placement: "bottomRight",
                    });
                }
            })
            .catch(error => {
                notification.warning({
                    message: `Notification`,
                    description: 'An error occurred, please try again',
                    placement: "bottomRight",
                });
                dispatch(loadingCategories(false))
            });
    }
}

export const fetchCategories = () => {
    return (dispatch) => {
        dispatch(loadingCategories(true))

        FirebaseFunctions.getCategories()
            .then((response) => {
                dispatch(getCategories(response.reverse()))
                dispatch(loadingCategories(false))
            })
            .catch((err) => {
                dispatch(getCategories([]))
                dispatch(loadingCategories(false))
            });
    }
};

export const deleteCategory = (id) => {
    return (dispatch) => {
        dispatch(loadingCategories(true))

        Firebase.database.ref(`/categories`).child(id).remove().then(function () {
            dispatch(fetchCategories())
            dispatch(loadingCategories(false))
            notification.success({
                message: `Notification`,
                description: "You deleted a category",
                placement: "bottomRight",
            });
        }).catch(error => {
            notification.warning({
                message: `Notification`,
                description: 'An error occurred, please try again',
                placement: "bottomRight",
            });
            dispatch(loadingCategories(false))
        });
    }
}

export const getAllListPosts = () => {
    return (dispatch) => {
        Firebase.getListPosts().once('value').then(snapshot => {
            if (snapshot.val() === null) {
                dispatch(setStatePostsData([]))
            } else {
                let allList = [...Object.values(snapshot.val())],
                    dataSource = [];
                for (let i = 0; i < allList.length; i++) {
                    let obj = {};
                    for (let propertyItem in allList[i]) {
                        if (propertyItem === "PHOTO") {
                            obj[propertyItem] = allList[i][propertyItem]["imgUrl"]
                        } else if (propertyItem === "SLIDE") {
                            obj[propertyItem] = allList[i][propertyItem]["imgUrls"]
                        } else if (propertyItem === "created_at") {
                            obj["id"] = allList[i][propertyItem]["time"]
                        } else {
                            obj[propertyItem] = allList[i][propertyItem]["text"]
                        }
                    }

                    dataSource.push(obj)
                }
                dispatch(setStatePostsData([...dataSource]))
            }

        });
    }
}

export const setStatePostsData = (data) => {
    return {
        type: GET_DATA_POSTS, payload: data
    }
}