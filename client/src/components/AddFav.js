import React, {useEffect} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {InputBase} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        marginLeft: '-10px',
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        marginLeft: '-5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    search: {
        position: 'relative',
        marginTop: '10px',
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#F7F7F7',
        },
        width: '368px',
        height: '44px',
    },
    focusedSearch: {
        position: 'relative',
        marginTop: '10px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#F7F7F7',
        },
        width: '368px',
        height: '44px',
    },
    inputRoot: {
        marginTop: '5px',
        marginLeft: '-70px',
        fontSize: '16px',
        color: 'inherit',
        fontFamily: 'AvenirNextMedium',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const StyledButton = withStyles({
    root: {
        color: '#666',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '15px',
        textTransform: 'none',
        background: "#FFF",
        '&:hover': {
            background: "#FFF",
            color: '#000',
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

export default function AddFav(props) {
    const classes = useStyles();

    const [search, setSearch] = React.useState("");
    const [filtered, setFiltered] = React.useState([]);
    const [focused, setFocused] = React.useState(false);

    const addFavorite = (element) => {
        console.log(element);
        console.log(localStorage.getItem(("id")))
        axios.post('http://localhost:5000/add_favorite', {
            topic: element
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET BOARD", res.data)
                if (res.data.success)
                    props.handleClose()
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleListItemClick = (event, index, element) => {
        addFavorite(element);
    }

    useEffect(() => {
        setFiltered(props.favorites)
        console.log(props.favorites);
    }, []);

    const handleChange = (e) => {
        let currentList = [];
        let newList = [];

        if (e.target.value !== "") {
            currentList = props.favorites;
            newList = currentList.filter(item => {
                const lc = item.toLowerCase();
                console.log("LC", lc);
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = props.favorites;
        }
        setFiltered(newList)
    }

    return (
        <div>
            <DialogTitle disableTypography classes={{root: classes.dialogTitle}} id="form-dialog-title">
                <StyledButton onClick={() => {props.handleClose()}}>
                    <ChevronLeftIcon style={{color: '#666'}} />
                    Edit favorite
                </StyledButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div className={focused ? classes.focusedSearch : classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon style={{width: '30px', height: '30px'}}/>
                        </div>
                        <InputBase
                            autoFocus={true}
                            value={search}
                            onBlur={() => setFocused(false)}
                            onFocus={() => setFocused(true)}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleChange(e)}
                            }
                            placeholder="What's your passion?"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </div>
                <List component="nav" aria-label="topic list" style={{}}>
                    {filtered.map((element, index) => {
                        console.log(element);
                        return (
                            <ListItem
                                button
                                key={index}
                                onClick={(event) => handleListItemClick(event, index, element)}
                            >
                                <ListItemText primary={<Typography style={{fontSize: '22px', fontWeight: 900, fontFamily: 'HelveticaNeueBold'}}>{element.toUpperCase()}</Typography>} />
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px', marginBottom: '10px'}}>
                <StyledCancelButton
                    style={{fontSize: '13px', height: '36px', textTransform: 'none'}}
                    onClick={() => {
                        props.handleClose();
                    }}
                    variant="outlined">
                    Cancel
                </StyledCancelButton>
            </DialogActions>
        </div>
    )
}
