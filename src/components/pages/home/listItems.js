import React from 'react';
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core';
import {PostAdd, Pages, AssignmentLate, EventAvailable, ContactPhone, Group} from '@material-ui/icons';
import CategoryIcon from '@material-ui/icons/Category';
/* Pages settings tools */
import PagesSettingsList from "../constructor/pagesComponents/PagesSettingsList";
import EventsSettingsList from "../constructor/eventsComponents/EventsSettingsList";
import PostSettings from "../constructor/postsComponents/PostSettingsList";

const useStyles = makeStyles(() => ({
    title: {
        color: 'black',
    },
}));

function MainListItems(props) {
    const {lang, pageCreator} = props;
    const {home} = useSelector(state => state);

    const firstList = [
        {id:1, name: lang.pages_, icon: <Pages />, type: "nav-bar"},
        {id:2, name: lang.post, icon: <PostAdd />, type: "post"},
        {id:3, name: lang.events, icon: <EventAvailable />, type: "events"},
        {id:6, name: lang.category, icon: <CategoryIcon />, type: "category"},
    ];

    if(home.site.navBar.pages.filter(page => page.name === "aboutUs").length > 0){
        firstList.push({id:4, name: lang.about_us, icon: <Group />, type: "aboutUs"})
    }

    if(home.site.navBar.pages.filter(page => page.name === "contactUs").length > 0){
        firstList.push({id:5, name: lang.contact_us, icon: <ContactPhone />, type: "contactUs"})
    }

    return(
        <div>
            {firstList.map(item=>(
                <ListItem button key={item.id} onClick={()=>pageCreator(item.type)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItem>
            ))}
        </div>
    );
}

function SecondaryListItems(props){
    const classes = useStyles();
    const {lang, activeAction, showPagesSettings} = props;

    const notSelected = (
            <ListItem button>
                <ListItemIcon>
                    <AssignmentLate />
                </ListItemIcon>
                <ListItemText primary={lang.section_not_selected} />
            </ListItem>
        );

    return (
        <div>
            <ListSubheader inset className={classes.title}>{lang.advanced_settings}</ListSubheader>

            {/* constructor settings tools section */}
            {(() => {
                switch (activeAction) {
                    case "nav-bar":
                        return <PagesSettingsList lang={lang} showPagesSettings={showPagesSettings}/>
                    case "events":
                        return <EventsSettingsList lang={lang} showPagesSettings={showPagesSettings}/>
                    case "post":
                        return <PostSettings lang={lang} showPagesSettings={showPagesSettings}/>
                    case "event":
                    default: return notSelected;
                }
            })()}
        </div>
    );
}

export {MainListItems, SecondaryListItems};