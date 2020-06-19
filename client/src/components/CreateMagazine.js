import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {InputBase} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        marginLeft: '-10px',
        fontFamily: 'HelveticaNeueBold',
        fontSize: '22px'
    },
    inputRoot: {
        width: '370px',
        marginLeft: '10px',
        marginTop: '5px',
        fontSize: '16px',
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '350px',
    },
    inputDescRoot: {
        width: '370px',
        marginLeft: '10px',
        marginBottom: '3px',
        fontSize: '16px',
        fontFamily: 'AvenirNextMedium',
        color: 'inherit',
    },
    inputDescInput: {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '350px',
    },
    focusedTitle: {
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '-8px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '44px',
        width: '370px'
    },
    title: {
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '-8px',
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '44px',
        width: '370px'
    },
    focusedDescription: {
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '10px',
        marginBottom: '10px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '140px',
        width: '370px'
    },
    description: {
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '140px',
        width: '370px'
    },
}))

const StyledButton = withStyles({
    root: {
        color: 'white',
        display: 'flex',
        elevation: 0,
        fontWeight: 'bold',
        fontSize: '17px',
        textTransform: 'none',
        background: "#F52828",
        '&:hover': {
            background: "#E00A0A",
        },
    },
})(Button);

const StyledCancelButton = withStyles({
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

export default function CreateMagazine(props) {
    const classes = useStyles();

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [titleFocused, setTitleFocused] = React.useState(false);
    const [descriptionFocused, setDescriptionFocused] = React.useState(false);

    const create = () => {
        console.log(localStorage.getItem(("id")))
        axios.post('http://localhost:5000/add_magazine', {
            title: title,
            description: description,
            public: false,
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET BOARD", res.data)
                if (res.data.success)
                    props.handleCreateClose()
            })
            .catch(err => {
                console.error(err)
            })
    }


    return (
        <div>
            <Dialog open={props.open} onClose={() => props.handleCreateClose} aria-labelledby="form-dialog-title">
                <DialogTitle disableTypography classes={{root: classes.dialogTitle}} id="form-dialog-title">CREATE NEW MAGAZINE</DialogTitle>
                <DialogContent>
                    <div style={{}}>
                        <div className={titleFocused ? classes.focusedTitle : classes.title}>
                            <InputBase
                                autoFocus={false}
                                value={title}
                                onBlur={() => setTitleFocused(false)}
                                onFocus={() => setTitleFocused(true)}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                        <div className={descriptionFocused ? classes.focusedDescription : classes.description}>
                            <InputBase
                                autoFocus={false}
                                multiline={true}
                                value={description}
                                rows={5}
                                onBlur={() => setDescriptionFocused(false)}
                                onFocus={() => setDescriptionFocused(true)}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optionnal)"
                                classes={{
                                    root: classes.inputDescRoot,
                                    input: classes.inputDescInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{marginBottom: '10px'}}>
                    <StyledCancelButton style={{height: '45px', textTransform: 'none'}} onClick={() => {
                        props.handleCreateClose()
                    }} variant="outlined">
                        Cancel
                    </StyledCancelButton>
                    <StyledButton
                        style={{height: '45px', textTransform: 'none', marginRight: '18px'}}
                        onClick={() => create()}
                        variant="contained"
                        color="primary">
                        Save
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
