import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SearchIcon from '@material-ui/icons/Search';
import {InputBase} from "@material-ui/core";
import TopicList from "./TopicList";
import {Redirect} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
            backgroundColor: '#EFEFEF',
        },
        marginRight: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
        height: '44px',
    },
    focusedSearch: {
        position: 'relative',
        marginTop: '10px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        marginRight: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
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
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


export default function SearchDrawer(props)  {
    const classes = useStyles();
    const [focused, setFocused] = React.useState(true);
    const [selectedTopic, setSelectedTopic] = React.useState(false);
    const [filtered, setFiltered] = React.useState([]);
    const [clickedTopic, setClickedTopic] = React.useState("")
    const [search, setSearch] = React.useState("")

    const renderRedirect = () => {
        if (selectedTopic) {
            return (
                <Redirect
                    to={`/topic/${clickedTopic}`}
                />
            );
        }
    };

    const handleChange = (e) => {
        let currentList = [];
        let newList = [];

        if (e.target.value !== "") {
            currentList = props.topics;
            newList = currentList.filter(item => {
                const lc = item.toLowerCase();
                console.log("LC", lc);
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = props.topics;
        }
        setFiltered(newList)
    }

    useEffect(() => {
        console.log(props.topics)
        setFiltered(props.topics)
    }, [props.refresh])

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Drawer anchor={anchor} open={props.drawerIsOpen} onClose={props.handleDrawerState}>
                        <div style={{minWidth: "350px"}}>
                            <div className={focused ? classes.focusedSearch : classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon style={{width: '30px', height: '30px'}}/>
                                </div>
                                <InputBase
                                    autoFocus={true}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleChange(e)}
                                    }                                    onBlur={() => setFocused(false)}
                                    onFocus={() => setFocused(true)}
                                    placeholder="Search on Flipboard"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            <TopicList handleDrawerState={props.handleDrawerState} setSelectedTopic={setSelectedTopic} setClickedTopic={setClickedTopic} topics={filtered}/>
                        </div>
                    </Drawer>
                </React.Fragment>
            ))}
            {renderRedirect()}
        </div>
    );
}
