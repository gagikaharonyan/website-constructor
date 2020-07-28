import {CHANGE_PAGE_DATA,GET_DATA_POSTS} from '../constants'
import Firebase from "../../Firebase/Firebase";

export const change_page_data = (data) => {
    return {
        type: CHANGE_PAGE_DATA, payload : data
    }
}

export const getAllListPosts = () => {
    return (dispatch) => {
        Firebase.getListPosts().once('value').then(snapshot => {
            if(snapshot.val() === null){
                dispatch(setStatePostsData([]))
            }else{
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