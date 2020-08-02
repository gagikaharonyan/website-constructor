import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, Input, Paper} from "@material-ui/core";
import CategoryList from "./categoryComponents/CategoryList";
import {fetchCategories, change_page_data, addCategory, deleteCategory} from "../../../store/actions/homeAction";
import {connect, useSelector} from "react-redux";
import {v1 as uuidv1} from 'uuid';
import {notification} from "antd";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '& span': {
            marginLeft: 5,
        },
    },
    h1: {
        color: '#000',
        fontSize: 30,
        textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 3px 6px rgba(0, 0, 0, 0.25), 0px 18px 23px rgba(0,0,0,0.1);',
    },
    emptyEvent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: '#eca407',
        fontWeight: 600,
        '& svg': {
            fontSize: 27,
            marginBottom: 5,
            color: '#9b6619',
        },
    },
    title: {
        textAlign: 'left',
        marginLeft: 25,
        fontSize: 18,
        borderBottom: '1px solid #9a9a9a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    todolist: {
        backgroundColor: "#FFF",
        padding: "20px 20px 10px 20px",
        marginTop: "30px",
        border: "2px solid #c1c1c1",
        borderRadius: "15px",
    },
    image: {
        '& img': {
            width: 250,
            height: 'auto',
        },
    },
    hr: {
        width: '50%',
        marginLeft: 4,
    },
    content: {
        textAlign: 'left',
    },
    subTitle: {
        fontSize: 15,
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function Category(props) {
    const classes = useStyles();
    const [inputText, setInputText] = useState("");
    const {lang} = props;
    const {home} = useSelector(state => state);
    const {site: {categories: {data, isLoading}}} = home;

    useEffect(() => {
        props.getListCategory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDeleteCategory = (id) => {
        props.deleteCategory(id)
    }

    const addCategory = (textInput) => {
        if (textInput.trim().length > 0) {
            let filtered = data.filter((el) => el.category.toLowerCase() === textInput.toLowerCase())

            if (!filtered.length) {
                let id = uuidv1(),
                    sendData = {id, category: textInput};
                props.addedCategory(sendData)
                setInputText("")
            } else {
                notification.warn({
                    message: `Notification`,
                    description: "This category has already been created",
                    placement: "bottomRight",
                });
            }
        } else {
            notification.warn({
                message: `Notification`,
                description: "Please add category name",
                placement: "bottomRight",
            });
        }

    }

    const onChangeInput = (ev) => {
        setInputText(ev.target.value)
    }

    const onKeyboardPress = (ev) => {
        if (ev.key === 'Enter') {
            addCategory(inputText)
        }
    }


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>

                <Grid item xs={12}>
                    <div className={classes.todolist}>
                        <h2 className={`${classes.h1}`}>{lang.category}</h2>
                        <span style={{display: "flex"}}>
                                <Input onKeyPress={onKeyboardPress}
                                       onChange={onChangeInput}
                                       value={inputText}
                                       placeholder="Add Category"
                                       fullWidth type="text"
                                />
                            <Button onClick={() => addCategory(inputText)} variant="contained"
                                    color="primary">Add</Button>
                            </span>

                        <CategoryList onDeleteCategory={onDeleteCategory} isLoading={isLoading} list={data}/>
                    </div>
                </Grid>

            </Paper>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeHomeState: (data) => {
            dispatch(change_page_data(data))
        },
        getListCategory: () => {
            dispatch(fetchCategories())
        },
        addedCategory: (data) => {
            dispatch(addCategory(data))
        },
        deleteCategory: (id) => {
            dispatch(deleteCategory(id))
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Category)