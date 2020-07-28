import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {change_current_settings, change_page_data,change_events_state} from "../../../store/actions/homeAction";
import {useToasts} from "react-toast-notifications";
import Event from './eventsComponents/Event';
import EventsList from "./eventsComponents/EventsList";
import FirebaseFunctions from "../../../Firebase/FirebaseFunctions";

function Events(props) {
    const {addToast} = useToasts();
    const {home} = useSelector(state => state);
    const [eventsData, setEventsData] = useState({});
    const [editEventData, setEditEventData] = useState({});
    const {lang} = props;

    useEffect(function () {
        if(Object.keys(home.site.events).length > 0){
            setEventsData({...home.site.events});
            if(home.currentSetting === "newEvent"){
                setEditEventData({});
            }
        }else {
            getEventsData();
        }
    }, [home.currentSetting])

    const editEvent = (id) => {
        setEditEventData({...home.site.events[id]});
        props.changeCurrentSettings("editEvent");
    }

    const getEventsData = () => {
        FirebaseFunctions.getEvents()
            .then(response => {
                if(Object.keys(response).length > 0){
                    setEventsData({...response});
                    props.changeEventsState({...response});
                }
            })
            .catch(error => {
                setEventsData({});
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            });
    }

    const updateEventsList = () => {
        getEventsData();
    }

    return (
        <>
            { home.currentSetting === 'newEvent' || home.currentSetting === 'editEvent' ?
                <Event lang={lang} editEventData={editEventData}/> :
                <EventsList lang={lang} events={eventsData} updateEventsList={updateEventsList} editEvent={editEvent}/>
            }
        </>
    );
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeHomeState: (data) => {dispatch(change_page_data(data))},
        changeCurrentSettings: (data) => {dispatch(change_current_settings(data))},
        changeEventsState: (data) => {dispatch(change_events_state(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Events);