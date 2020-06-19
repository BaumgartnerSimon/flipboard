import React, {useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import withStyles from "@material-ui/core/styles/withStyles";
import {InputBase} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CreateMagazine from "./CreateMagazine";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheckIcon from '@material-ui/icons/Check';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        marginTop: "5px",
        fontFamily: 'HelveticaNeueBold',
        fontSize: '30px'
    },
    inputSearchRoot: {
        width: '250px',
        marginLeft: '10px',
        marginTop: '5px',
        fontSize: '16px',
        color: 'inherit',
    },
    inputSearchInput: {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '250px',
    },
    focusedSearch: {
        marginTop: '-8px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '44px',
        width: '270px'
    },
    search: {
        marginTop: '-8px',
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '44px',
        width: '270px'
    },
    inputDescRoot: {
        width: '370px',
        marginLeft: '10px',
        marginBottom: '3px',
        fontSize: '16px',
        color: 'inherit',
    },
    inputDescInput: {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '370px',
    },
    focusedTitle: {
        marginTop: '-8px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '44px',
        width: '390px'
    },
    title: {
        marginTop: '-8px',
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '44px',
        width: '390px'
    },
    inputRoot: {
        width: '370px',
        marginLeft: '10px',
        marginTop: '5px',
        fontFamily: 'AvenirNextMedium',
        fontSize: '16px',
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '370px',
    },
    focusedDescription: {
        marginTop: '8px',
        marginBottom: '8px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '140px',
        width: '390px'
    },
    description: {
        marginTop: '8px',
        marginBottom: '8px',
        borderRadius: '10px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '140px',
        width: '390px'
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

export default function FlipIn(props) {
    const classes = useStyles();
    const [url, setUrl] = React.useState("");
    const [magazines, setMagazines] = React.useState([]);
    const [filtered, setFiltered] = React.useState([]);
    const [comment, setComment] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [titleFocused, setTitleFocused] = React.useState(false);
    const [searchFocused, setSearchFocused] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [descriptionFocused, setDescriptionFocused] = React.useState(false);
    const [selectedMagazineId, setSelectedMagazineId] = React.useState("");

    const handleCreateClickOpen = () => {
        setOpen(true)
    }

    const getMagazine = () => {
        axios.get('http://localhost:5000/get_magazines', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET MAGAZINES", res.data);
                setMagazines(res.data.private_magazines)
                setFiltered(res.data.private_magazines);
            })
            .catch(err => {
                console.error(err)
            })
    }


    const handleCreateClose = () => {
        getMagazine();
        setOpen(false)
    }

    const handleListItemClick = (event, index, id) => {
        console.log("IDDDDDDDDD",id);
        setSelectedMagazineId(id);
        setSelectedIndex(index);
    };

    const flipIn = () => {
        console.log(selectedMagazineId);
        axios.post('http://localhost:5000/flip_to_magazine', {
            magazine_id: selectedMagazineId,
            link: url,
            comment: comment
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE FLIPIN", res.data)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleChange = (e) => {
        let currentList = [];
        let newList = [];

        if (e.target.value !== "") {
            currentList = magazines;
            newList = currentList.filter(item => {
                const lc = item.title.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = magazines;
        }
        setFiltered(newList);
    }


    useEffect(() => {
        setUrl(props.url)
        setFiltered(magazines);
        if (props.url !== "")
            getMagazine()
        else {
            setMagazines(props.magazines);
            setFiltered(props.magazines);
        }
        if (props.open && magazines[0]) {
            setSelectedMagazineId(magazines[0]._id)
        }
    }, [props.refresh]);

    return (
        <div>
            <CreateMagazine open={open} handleCreateClose={handleCreateClose}/>
            <Dialog maxWidth={false} open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle disableTypography classes={{root: classes.dialogTitle}} id="form-dialog-title">FLIP INTO MAGAZINE</DialogTitle>
                <div style={{marginBottom: '10px', marginTop: '20px', display: 'flex', flexDirection: 'row'}}>
                    <div>
                        <DialogContentText style={{marginLeft: '25px', color: 'black', fontFamily: 'HelveticaNeueBold', fontSize: '22px'}}>
                            MAGAZINES
                        </DialogContentText>
                        <DialogContent>
                            <div>
                                <div className={searchFocused ? classes.focusedSearch : classes.search}>
                                    <InputBase
                                        autoFocus={false}
                                        value={search}
                                        onBlur={() => setSearchFocused(false)}
                                        onFocus={() => setSearchFocused(true)}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleChange(e)}
                                        }
                                        placeholder="Search magazines"
                                        classes={{
                                            root: classes.inputSearchRoot,
                                            input: classes.inputSearchInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                        <div>
                            <Button onClick={() => handleCreateClickOpen()} style={{textTransform: 'none', width: '270px', marginLeft: '25px', display: 'flex', flexDirection: 'row'}}>
                                <div style={{marginRight: 'auto', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'50px', width:'50px', borderRadius: '3px', border: '1px solid red'}}>
                                        <AddIcon style={{color: 'red '}}/>
                                    </div>
                                    <div style={{marginLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <Typography style={{fontWeight: '500', fontSize: '17px', color: 'red'}}>
                                            Create Magazine
                                        </Typography>
                                    </div>
                                </div>
                            </Button>
                            <List component="nav" aria-label="topic list" style={{marginLeft: '20px', marginRight: '20px'}}>
                                {filtered.map((element, index) => {
                                    return (
                                        <ListItem
                                            button
                                            key={index}
                                            selected={selectedIndex === index}
                                            onClick={(event) => handleListItemClick(event, index, element._id)}
                                        >
                                            <ListItemText primary={element.title} />
                                            {selectedIndex === index &&
                                                <ListItemIcon>
                                                    <CheckIcon style={{marginLeft: '30px', color: 'red'}}/>
                                                </ListItemIcon>}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                    </div>
                    <Divider style={{marginBottom: '10px'}} orientation="vertical" flexItem />
                    <div>
                        <DialogContentText style={{marginLeft: '25px', color: '#666', fontSize: '15px'}}>
                            Paste or enter a URL to flip
                        </DialogContentText>
                        <DialogContent>
                            <div>
                                <div className={titleFocused ? classes.focusedTitle : classes.title}>
                                    <InputBase
                                        autoFocus={false}
                                        value={url}
                                        onBlur={() => setTitleFocused(false)}
                                        onFocus={() => setTitleFocused(true)}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Flip link"
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
                                        value={comment}
                                        rows={5}
                                        onBlur={() => setDescriptionFocused(false)}
                                        onFocus={() => setDescriptionFocused(true)}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment (optionnal)"
                                        classes={{
                                            root: classes.inputDescRoot,
                                            input: classes.inputDescInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </div>
                </div>
                <Divider />
                <DialogActions style={{marginTop: '10px', marginBottom: '10px'}}>
                    <StyledCancelButton
                        style={{fontSize: '13px', height: '36px', textTransform: 'none'}}
                        onClick={() => {
                            getMagazine();
                            props.handleClose();
                        }} variant="outlined">
                            Cancel
                    </StyledCancelButton>
                    <StyledButton
                        style={{fontSize: '13px', height: '36px', textTransform: 'none', marginRight: '18px'}}
                        onClick={() => {
                            flipIn();
                            getMagazine();
                            props.handleClose();
                        }}
                        variant="contained"
                        color="primary">
                        Save
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
