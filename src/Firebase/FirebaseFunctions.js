import Firebase from './Firebase'

/* Add New Event  */ /* (public) */
const addNewData = (table, id, data) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`${table}/${id}`).set({
            ...data
        },function(error) {
            if (error) {
                reject({message: `Database error. '${table} Add' data! ${error.message}`})
            } else {
                resolve({result: true})
            }
        }).catch(error=>{
            reject({message: `Database error. '${table} Add' data! ${error.message}`})
        });
    });
};

/* Upload Image  */ /* (public) */
const uploadImage = (data, directory, previous = "") => {
    return new Promise((resolve, reject) => {
        let url = ""
        if(data.file){
            let storageRef = Firebase.storage.ref(`storage/images/${directory}`)
            let uploadTask = storageRef.child(`/${data.name}`).put(data.file)
            uploadTask.on('state_changed', function(snapshot){
            }, function(error) {
                reject({message:`Failed to upload image: ${error.message}`})
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    if(downloadURL){
                        resolve({downloadURL})
                    }else{
                        reject({message:`Failed to load image's URL: ${url}`})
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
                resolve(eventsData)
            }else if(eventsData == null){
                reject({message: 'Database error. Empty `Events` data!'})
            }
        }).catch(error => {
            reject({message: `Database error. 'Events' data! ${error.message}`})
        });
    });
};

/* Delete Events Data */ /* (public) */
const deleteEventById = (id, image) => {
    return new Promise(function(resolve, reject) {
        if(image !== ""){
            deleteImage(image).then((response) => {
                if(response === true){
                    deleteEvent(id).then(function() {
                        resolve({result: true})
                    }).catch(error => {
                        reject({message: `Database error. 'Event' data! ${error.message}`})
                    });
                }
            }).catch(error => {
                reject({message: `Database error. 'Event Image' data! ${error.message}`})
            });
        }else{
            deleteEvent(id).then(function() {
                resolve({result: true})
            }).catch(error => {
                reject({message: `Database error. 'Event' data! ${error.message}`})
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
const updateData = (table, id, data) => {
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

const FirebaseFunctions = {
    addNewData, // add new data in firebase db
    uploadImage, // upload image in firebase store
    getEvents, // get all events data from firebase db
    deleteEventById, // delete event by id from firebase db
    updateData, // update data by id from firebase db
};

export default FirebaseFunctions;