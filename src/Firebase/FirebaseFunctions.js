import Firebase from './Firebase'

/* Add New Event  */ /* (public) */
const addNewData = (table, id, data) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`${table}/${id}`).set({
            ...data
        },function(error) {
            if (error) {
                reject({message: `Database error. '${table} Add' data! ${error.message}`});
            } else {
                resolve({result: true});
            }
        }).catch(error=>{
            reject({message: `Database error. '${table} Add' data! ${error.message}`});
        });
    });
};

/* Upload Image  */ /* (public) */
const uploadImage = (data, directory, previous = "") => {
    return new Promise((resolve, reject) => {
        let url = ""
        if(data.file){
            let storageRef = Firebase.storage.ref(`storage/images/${directory}`);
            let uploadTask = storageRef.child(`/${data.name}`).put(data.file);
            uploadTask.on('state_changed', function(snapshot){
            }, function(error) {
                reject({message:`Failed to upload image: ${error.message}`});
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    if(downloadURL){
                        resolve({downloadURL});
                    }else{
                        reject({message:`Failed to load image's URL: ${url}`});
                    }
                });
            });
        }
        if(previous !== ""){
            deleteImage(previous);
        }
    });
};

/* Get Events Data */ /* (public) */
const getEvents = () => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/events`).once('value').then(function(snapshot) {
            let eventsData = snapshot.val();
            if(eventsData && Object.keys(eventsData).length !== 0 && eventsData.constructor === Object){
                resolve(eventsData);
            }else if(eventsData == null){
                reject({message: 'Database error. Empty `Events` data!'});
            }
        }).catch(error => {
            reject({message: `Database error. 'Events' data! ${error.message}`});
        });
    });
};

/* Delete Events Data */ /* (public) */
const deleteEventById = (id, images) => {
    return new Promise(function(resolve, reject) {
        const length = images.length;
        if(length && length !== 0){
            for (let i=0; i< length;i++){
                deleteImage(images[i].name).catch(error => {
                    reject({message: `Database error. 'Event Image' data! ${error.message}`});
                });
            }
            deleteEvent(id).then(function() {
                resolve({result: true});
            }).catch(error => {
                reject({message: `Database error. 'Event' data! ${error.message}`});
            });
        }else{
            deleteEvent(id).then(function() {
                resolve({result: true});
            }).catch(error => {
                reject({message: `Database error. 'Event' data! ${error.message}`});
            });
        }
    });
};

/* Delete Event */ /* (public) */
const deleteEvent = (id) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/events`).child(id).remove().then(function() {
            resolve({result: true});
        }).catch(error => {
            reject(error);
        });
    });
};

/* Get Category Data */
const getCategories = () => {
    return new Promise(function (resolve, reject) {
        Firebase.getCategories().once('value').then(function (snapshot) {
            let categoriesData = snapshot.val();
            if (categoriesData && Object.keys(categoriesData).length !== 0 && categoriesData.constructor === Object) {
                resolve(Object.values(categoriesData));
            } else if (categoriesData == null) {
                reject({message: 'Database error. Empty `Categories` data!'});
            }
        }).catch(error => {
            reject({message: `Database error. 'Categories' data! ${error.message}`});
        });
    });
};

/* Get AboutUs Data */
const getAboutUs = () => {
    return new Promise(function (resolve, reject) {
        Firebase.getAboutUs().once('value').then(function (snapshot) {
            let aboutUsData = snapshot.val();
            if (aboutUsData && Object.keys(aboutUsData).length !== 0 && aboutUsData.constructor === Object) {
                resolve(Object.values(aboutUsData));
            } else if (aboutUsData == null) {
                reject({message: 'Database error. Empty `AboutUs` data!'});
            }
        }).catch(error => {
            reject({message: `Database error. 'AboutUs' data! ${error.message}`});
        });
    });
};

/* Deleting images from storage */ /* (static) */
const deleteImage = (data) => {
    return new Promise(function(resolve, reject) {
        let storageRef = Firebase.storage.ref(`storage/images/events/`)
        storageRef.child(data).delete().then(function() {
            resolve(true);
        }).catch(function(error) {
            reject(error);
        });
    });
};

/* Update Data */ /* (public) */
const updateDataById = (table, id, data) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(table).child(id).update(data,function (error) {
            if(error){
                reject({message: `Database error. '${table}' data! ${error.message}`});
            }else {
                resolve({result: true});
            }
        }).catch(error => {
            reject({message: `Database error. '${table}' data! ${error.message}`});
        });
    });
}

/* Update Data */ /* (public) */
const updateData = (table, data) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(table).set(data, function (error) {
            if(error){
                reject({message: `Database error. '${table}' data! ${error.message}`});
            }else {
                resolve({result: true});
            }
        }).catch(error => {
            reject({message: `Database error. '${table}' data! ${error.message}`});
        });
    });
}

/* Get Data */ /* (public) */
const getData = (table) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/${table}`).once('value').then(function(snapshot) {
            let data = snapshot.val();
            if(data && Object.keys(data).length !== 0 && data.constructor === Object){
                resolve(data);
            }else if(data.constructor === Array && data.length > 0){
                resolve(data);
            }else{
                reject({message: `Database error. Empty ${table} data!`});
            }
        }).catch(error => {
            reject({message: `Database error. ${table} data! ${error.message}`});
        });
    });
}

/* Deleting image by name from storage */ /* (public) */
const deleteImageByName = (directory, name) => {
    return new Promise(function(resolve, reject) {
        let storageRef = Firebase.storage.ref(`storage/images/${directory}/`)
        storageRef.child(name).delete().then(function() {
            resolve({result: true});
        }).catch(function(error) {
            reject({message: `Database error. ${directory} data! ${error.message}`});
        });
    });
};


/* Upload Image  */ /* (public) */
const imageData = (data, directory) => {
    return new Promise((resolve, reject) => {
        let url = ""
        if(data.file){
            let storageRef = Firebase.storage.ref(`storage/images/${directory}`);
            let uploadTask = storageRef.child(`/${data.name}`).put(data.file);
            uploadTask.on('state_changed', function(snapshot){
            }, function(error) {
                reject({message:`Failed to upload image: ${error.message}`});
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    if(downloadURL){
                        resolve({name: data.name, url: downloadURL});
                    }else{
                        reject({message:`Failed to load image's URL: ${url}`});
                    }
                });
            });
        }
    });
};

/* Upload multi image in from storage */ /* (public) */
async function uploadMultiImage (data, directory) {
    const images = [];
    const length = data.length;
    for(let i = 0; i < length; i++){
        let image = await imageData(data[i], directory);
        images.push(image);
    }
    return images;
}

const removeSelectedImages = (data, directory) => {
    const length = data.length;
    for(let i = 0; i < length; i++){
        deleteImageByName(directory, data[i].name);
    }
};

const FirebaseFunctions = {
    addNewData, // add new data in firebase db
    uploadImage, // upload image in firebase store
    getEvents, // get all events data from firebase db
    getCategories, // get all Category data from firebase db
    getAboutUs, // get all AboutUs data from firebase db
    deleteEventById, // delete event by id from firebase db
    updateDataById, // update data by id in firebase db
    updateData, // update data in firebase db
    getData, // get data from firebase db
    deleteImageByName, // delete image by name from firebase store
    uploadMultiImage, // upload multi image in from firebase store
    removeSelectedImages, // remove images from firebase store
};

export default FirebaseFunctions;