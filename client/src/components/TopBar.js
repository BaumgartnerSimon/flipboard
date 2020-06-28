import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Topic from "./Topic";
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import SearchDrawer from "./SearchDrawer";
import {Redirect, withRouter} from "react-router-dom";
import FlipIn from "./FlipIn";
import axios from "axios";
import TopBarProfile from "./TopBarProfile";
import {AccountCircle} from "@material-ui/icons";
import Logo from '../assets/logoFlip60.png'
import Typography from "@material-ui/core/Typography";
import EditFav from "./EditFav";

class TopBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            description: 'The best of everything you follow',
            forYou: true,
            noSelect: false,
            focusedTopic: "",
            selectedSection: false,
            drawerIsOpen: false,
            editOpen: false,
            open: false,
            magazines: [],
            favorites: [],
            maxFav: [],
            refresh : false,
            anchorEl: null,
            anchorElBoard: null,
            refreshFav: false,
            refreshSearch: false,
            loadFav: false,
            selected: 0,
        }
    }

    renderRedirect = () => {
        if (this.state.selectedSection) {
            return (
                <Redirect
                    to={`/section/${this.state.focusedTopic}`}
                />
            );
        }
    };

    handleTopic = (index, element) => {
        this.setState({noSelect: false, forYou: false, selected: index, selectedSection: true, focusedTopic: element})
    };

    handleForYou = () => {
        this.setState({noSelect: false, forYou: true, selectedSection: false})
        this.props.history.push('/');
    }

    handleMenuClose = () => {
        console.log('CLOOOOOOSE');
        this.setState({anchorEl: null});
    };

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClickOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open: false})
    }

    handleDrawerState = () => {
        console.log('STATE');
        this.getAbout();
        this.setState({drawerIsOpen: !this.state.drawerIsOpen})
    }

    handleEditOpen = () => {
        this.setState({refreshFav: !this.state.refreshFav, editOpen: true})
    }

    handleEditClose = () => {
        this.setState({editOpen: false})
    }

    handleMenuClick = () => {
        this.setState({noSelect: true, forYou: false});
    }

    getFavorites = () => {
        axios.get('http://localhost:5000/get_favorites', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET FAV", res.data);
                if (res.data.success) {
                    this.setState({loadFav: true, refreshFav: !this.state.refreshFav, favorites: res.data.favorites})
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    getAbout = () => {
        axios.get('http://localhost:5000/about.json', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE ABOUT", res.data)
                if (res.data.success)
                    this.setState({refreshSearch: !this.state.refreshSearch, maxFav: res.data.favorites})
            })
            .catch(err => {
                console.error(err)
            })
    }

    componentDidMount() {
        console.log(localStorage.getItem(("id")))
        this.getAbout();
        this.getFavorites(true);
    }

    render() {
        console.log('GET MATCH PROPS', this.props.location.pathname);
        if (this.props.location.pathname !== "/login") {
            return (
                <div style={{flexGrow: 1}}>
                    <EditFav getFavorites={this.getFavorites} refresh={this.state.refreshFav} maxFav={this.state.maxFav}
                             favorites={this.state.favorites} open={this.state.editOpen}
                             handleClose={this.handleEditClose}/>
                    <FlipIn refresh={this.state.refresh} open={this.state.open} handleClose={this.handleClose}/>
                    <SearchDrawer refresh={this.state.refreshSearch} topics={this.state.maxFav}
                                  drawerIsOpen={this.state.drawerIsOpen} handleDrawerState={this.handleDrawerState}/>
                    <AppBar style={{height: '60px', backgroundColor: 'black'}} elevation={2} position="fixed">
                        <Toolbar>
                            <Link
                                onClick={() => this.props.history.push("/")}
                            >
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="open drawer"
                                    style={{marginTop: '-4px', marginLeft: '-36px'}}
                                >
                                    <img alt={"Logo"} src={Logo}/>
                                </IconButton>
                            </Link>
                            <IconButton style={{marginLeft: '-10px', marginRight: '-10px'}}
                                        onClick={() => this.handleForYou()}>
                                <Topic selected={this.state.forYou} topic={"FOR YOU"}/>
                            </IconButton>
                            {this.state.loadFav && this.state.favorites.map((element, ind) => {
                                console.log('ELEMENT', this.state.forYou);
                                return (
                                    <IconButton key={ind} style={{marginLeft: '-10px', marginRight: '-10px'}}
                                                onClick={() => this.handleTopic(ind, element)}>
                                        <Topic selected={!this.state.noSelect && !this.state.forYou && ind === this.state.selected}
                                               topic={element.toUpperCase()}/>
                                    </IconButton>
                                );
                            })}
                            <IconButton style={{marginLeft: '-10px', marginRight: '-10px'}}
                                        onClick={() => this.handleEditOpen()}>
                                <div style={{
                                    marginTop: '-7px',
                                    flexDirection: 'column',
                                    marginLeft: '15px',
                                    marginRight: '15px'
                                }}>
                                    <Typography style={{
                                        fontSize: '20px',
                                        color: "white",
                                        fontWeight: 'bold',
                                        fontFamily: 'HelveticaNeueBold'
                                    }}>
                                        EDIT FAVORITES
                                    </Typography>
                                </div>
                            </IconButton>
                            <div style={{
                                marginLeft: 'auto',
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '-3px'
                            }}>
                                <IconButton onClick={() => this.handleDrawerState()}>
                                    <SearchIcon style={{width: '27px', height: '27px', color: 'white'}}/>
                                </IconButton>
                                <IconButton onClick={() => {
                                    this.setState({refresh: !this.state.refresh});
                                    this.handleClickOpen()
                                }}>
                                    <AddIcon style={{width: '27px', height: '27px', color: 'white'}}/>
                                </IconButton>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="open menu"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <AccountCircle style={{
                                        marginLeft: '10px',
                                        marginRight: '-20px',
                                        width: '40px',
                                        height: '40px',
                                        color: 'white'
                                    }}/>
                                </IconButton>
                            </div>
                            <TopBarProfile anchorEl={this.state.anchorEl} handleMenuClick={this.handleMenuClick} handleClose={this.handleMenuClose}/>
                            {this.renderRedirect()}
                        </Toolbar>
                    </AppBar>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default withRouter(TopBar)
