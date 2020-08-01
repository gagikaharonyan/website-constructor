import React from "react";
import {ListGroup} from "react-bootstrap";
import {makeStyles} from "@material-ui/core/styles";
import {Spin} from "antd";
import images from "../../../../images";
import {Popconfirm} from "antd";
import {List} from "antd"


const useStyles = makeStyles((theme) => ({
    listCategory: {
        maxHeight: '500px',
        overflowY: 'auto'
    },
    category: {
        display: 'flex',
        float: "right"
    },
    itemCatgeory: {
        marginTop: "10px",
        '&:hover': {
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundColor: '#c3e6cb',
            borderRadius: "10px"
        }
    },
    nameCategory: {
        margin: '0 auto',
        fontSize: '18px'
    }
}));

function CategoryList(props) {
    const classes = useStyles();

    const hoverImg = (e, mouse) => {
        if (mouse === "move") {
            e.target.src = images.redDeleteCategory;
        } else if (mouse === "out") {
            e.target.src = images.deleteCategory;
        }
    }

    const category = props.list.map((el) => {
        return (

            <List.Item key={Math.random()} className={classes.itemCatgeory}>
                <span className={classes.nameCategory}>{el.category}</span>
                <span className={classes.category}>
                    <Popconfirm title="Confirm delete" onConfirm={() => props.onDeleteCategory(el.id)}>
                       <img alt='smail' width="25" height="25"
                            onMouseOver={(e) => hoverImg(e, "move")}
                            onMouseOut={(e) => hoverImg(e, "out")}
                            src={images.deleteCategory}/>
                    </Popconfirm>
                </span>
            </List.Item>
        )
    })

    return (
        <ListGroup className={classes.listCategory}>
            {props.isLoading ? <Spin/> : category}
        </ListGroup>
    )
}

export default CategoryList