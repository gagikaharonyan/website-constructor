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
    GET_CATEGORIES,
    LOADING_ABOUTUS,
    GET_DATA_ABOUTUS
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

export const fetchAboutUs = () => {
    return (dispatch) => {
        dispatch(loadingAboutUs(true))

        FirebaseFunctions.getAboutUs()
            .then((response) => {
                console.log('asdasdasd', response)
                if (response.message === "Database error. Empty `AboutUs` data!") {
                    console.log("mtela")
                    dispatch(addAboutUs())
                } else {
                    dispatch(getAboutUs(response[0]))
                    dispatch(loadingAboutUs(false))
                }
            })
            .catch((err) => {
                if (err.message === "Database error. Empty `AboutUs` data!") {
                    console.log("mtela")
                    dispatch(addAboutUs())
                }
                dispatch(getAboutUs({}))
                dispatch(loadingAboutUs(false))
            });
    }
};

export const addAboutUs = () => {
    return (dispatch) => {
        let defaultData = {
            id: new Date().getTime(),
            title: "Title",
            description: `
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
              The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as 
              their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have
              evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
              `,
            avatar: "https://www.google.ru/url?sa=i&url=https%3A%2F%2Fwww.impactbnd.com%2Fblog%2Fbest-about-us-pages&psig=AOvVaw1FncZgOpktQkck637uUTxG&ust=1596406271567000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOCspfiC--oCFQAAAAAdAAAAABAD"
        }
        FirebaseFunctions.addNewData("aboutUs", defaultData.id, {...defaultData})
            .then(response => {
                console.log("2", response)
                if (response.result) {
                    dispatch(fetchAboutUs())
                    notification.success({
                        message: "Notification",
                        description: "You changed About Us Info",
                        placement: "bottomRight",
                    });
                }
            })
            .catch(error => {
                console.log(error)
                notification.warning({
                    message: `Notification`,
                    description: 'An error occurred, please try again',
                    placement: "bottomRight",
                });
                dispatch(loadingAboutUs(false))
            });
    }
}

export const changedCategory = (data) => {
    return (dispatch) => {
        dispatch(loadingAboutUs(true))

        FirebaseFunctions.updateDataById("aboutUs", data.id, {...data})
            .then(response => {
                if (response.result) {
                    console.log(response.result)
                    dispatch(fetchAboutUs())
                    notification.success({
                        message: "Notification",
                        description: "You changed About Us Info",
                        placement: "bottomRight",
                    });
                }
            })
            .catch(error => {
                console.log(error)
                notification.warning({
                    message: `Notification`,
                    description: 'An error occurred, please try again',
                    placement: "bottomRight",
                });
                dispatch(loadingAboutUs(false))
            });
    }
}


export const getAboutUs = (payload) => {
    return {
        type: GET_DATA_ABOUTUS,
        payload: payload
    }
}

export const loadingAboutUs = (boolean) => {
    return {
        type: LOADING_ABOUTUS,
        payload: boolean
    }
}


export const setStatePostsData = (data) => {
    return {
        type: GET_DATA_POSTS, payload: data
    }
}