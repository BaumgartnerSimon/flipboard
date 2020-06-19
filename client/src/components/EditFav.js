import React, {useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Typography from "@material-ui/core/Typography";
import AddFav from "./AddFav";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
        dialogTitle: {
            marginLeft: '-10px',
            fontFamily: 'HelveticaNeueBold',
            fontSize: '22px',
            width: '362px'
        },
    }
))

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const StyledButton = withStyles({
    root: {
        color: '#666',
        borderColor: '#666',
        fontWeight: 'bold',
        fontSize: '17px',
        '&:hover': {
            color: "black",
            borderColor: 'black',
        },
    },
})(Button);

const StyledCancelButton = withStyles({
    root: {
        color: '#666',
        borderColor: '#666',
        fontWeight: 'bold',
        width: '368px',
        '&:hover': {
            color: "black",
            borderColor: 'black',
        },
    },
})(Button);

export default function EditFav(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [favList, setFavList] = React.useState([]);

    const handleAddClickOpen = () => {
        setOpen(true)
    }

    const handleAddClose = () => {
        props.getFavorites(true);
        setOpen(false)
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        padding: 6,
        margin: `0 0 8px 0`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...draggableStyle
    });

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            favList,
            result.source.index,
            result.destination.index
        );
        console.log(items);
        setFavList(items);
        updateFavList(items)
    };

    const updateFavList = (items) => {
        console.log("FAVLIST", items);
        axios.post('http://localhost:5000/set_favlist', {
            favorites: items
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE UPDATE FAVLIST", res.data)
                if (res.data.success)
                    props.getFavorites(true);
            })
            .catch(err => {
                console.error(err)
            })

    }
    const removeFav = (element) => {
        axios.post('http://localhost:5000/remove_favorite', {
            topic: element
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE REMOVE FAV", res.data)
                if (res.data.success)
                    props.getFavorites(true);
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
        setFavList(props.favorites)
    }, [props.refresh]);

    return (
        <div>
            <Dialog maxWidth={false} open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                {open &&
                    <AddFav favorites={props.maxFav} handleClose={handleAddClose}/>
                }
                {!open &&
                <DialogTitle disableTypography classes={{root: classes.dialogTitle}} id="form-dialog-title">EDIT
                    FAVORITES</DialogTitle>
                }
                {!open &&
                <div style={{flexDirection: 'column', marginBottom: '9px', marginTop: '16px', display: 'flex'}}>
                    <div>
                        <div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{marginLeft: '16px', marginRight: '16px', width: '368px'}}
                                        >
                                            {favList.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Draggable draggableId={index.toString()}
                                                                   index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={getItemStyle(
                                                                        snapshot.isDragging,
                                                                        provided.draggableProps.style
                                                                    )}
                                                                >
                                                                    <DragIndicatorIcon style={{color: '#666'}}/>
                                                                    <Typography
                                                                        style={{fontFamily: 'AvenirNextMedium'}}>{item}</Typography>
                                                                    <IconButton size={'small'} style={{marginLeft: '10px'}} onClick={() => removeFav(item)}>
                                                                        <RemoveCircleIcon style={{width: '17px', height: '17px'}}/>
                                                                    </IconButton>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                        {index !== favList.length - 1 &&
                                                        <Divider/>
                                                        }
                                                    </div>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            <StyledButton
                                style={{
                                    marginBottom: '16px',
                                    marginTop: '5px',
                                    marginLeft: '16px',
                                    fontSize: '13px',
                                    height: '36px',
                                    textTransform: 'none'
                                }}
                                onClick={() => {
                                    handleAddClickOpen();
                                }} variant="outlined">
                                Add favorite
                            </StyledButton>
                        </div>
                    </div>
                    <Divider/>
                    <DialogActions style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '10px',
                    }}>
                        <StyledCancelButton
                            style={{fontSize: '13px', height: '36px', textTransform: 'none'}}
                            onClick={() => {
                                props.handleClose();
                            }} variant="outlined">
                            Close
                        </StyledCancelButton>
                    </DialogActions>
                </div>
                }
            </Dialog>
        </div>
    )
}
