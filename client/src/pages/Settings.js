import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import {AccountCircle} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {InputBase} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        width: '571px',
        marginLeft: '10px',
        marginTop: '5px',
        fontSize: '16px',
        fontFamily: 'AvenirNextMedium',
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '551px',
    },
    focused: {
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '44px',
        width: '571px'
    },
    form: {
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '44px',
        width: '571px'
    },
    bioFocused: {
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: '#D8D8D8',
        '&:hover': {
            backgroundColor: '#D8D8D8',
        },
        height: '88px',
        width: '571px'
    },
    bioForm: {
        borderRadius: '4px',
        border: '1px solid white',
        backgroundColor: '#F7F7F7',
        '&:hover': {
            backgroundColor: '#EFEFEF',
        },
        height: '88px',
        width: '571px'
    },
}))

const StyledButton = withStyles({
    root: {
        color: 'white',
        display: 'flex',
        elevation: 0,
        fontWeight: 'bold',
        fontSize: '13px',
        textTransform: 'none',
        background: "#F52828",
        '&:hover': {
            background: "#E00A0A",
        },
    },
})(Button);

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Settings() {
    const [username, setUsername] = React.useState("")
    const [newUsername, setNewUsername] = React.useState("")
    const [focused, setFocused] = React.useState(false);
    const [bioFocused, setBioFocused] = React.useState(false);
    const [bio, setBio] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const save = () => {
        axios.post('http://localhost:5000/update_username', {
            new_username: newUsername,
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE UPDATE", res.data)
                if (res.data.success) {
                    getUsername()
                    setMessage(res.data.message)
                    setSeverity('success')
                    setOpen(true)
                } else {
                    setMessage(res.data.message)
                    setSeverity('error')
                    setOpen(true)
                }
            })
            .catch(err => {
                console.error(err)
            })

    }

    const getUsername = () => {
        axios.get('http://localhost:5000/get_username', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET FAV", res.data);
                if (res.data.success) {
                    setUsername(res.data.username)
                    setNewUsername(res.data.username)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        getUsername()
    }, [])

    return (
        <div>
            <div style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: '60px', maxWidth: '1142px'}}>
                <div style={{paddingTop: '64px', paddingBottom: '16px', marginRight: 'auto', flexDirection: 'row', display: 'flex', alignItems: "center"}}>
                    <AccountCircle style={{ width: '90px', height: '90px'}}/>
                    <Typography style={{marginLeft: '10px', fontSize: '30px', fontFamily: 'HelveticaNeueBold'}}>
                        {username}
                    </Typography>
                </div>
                <Divider style={{marginBottom: '48px'}}/>
                <div>
                    <Typography style={{marginBottom: '12px', fontSize: '22px', fontFamily: 'HelveticaNeueBold'}}>USER SETTINGS</Typography>
                    <div>
                    <Typography style={{marginBottom: '4px', marginLeft: '4px', fontFamily: 'AvenirNextCondensedMedium', fontWeight: 500, fontSize: '15px', color: '#666'}}>Username</Typography>
                        <div className={focused ? classes.focused : classes.form}>
                            <InputBase
                                autoFocus={false}
                                value={newUsername}
                                onBlur={() => setFocused(false)}
                                onFocus={() => setFocused(true)}
                                onChange={(e) => setNewUsername(e.target.value)}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <Typography style={{marginBottom: '4px', marginLeft: '4px', fontFamily: 'AvenirNextCondensedMedium', fontWeight: 500, fontSize: '15px', color: '#666'}}>Bio</Typography>
                        <div className={bioFocused ? classes.bioFocused : classes.bioForm}>
                            <InputBase
                                autoFocus={false}
                                multiline={true}
                                rows={3}
                                value={bio}
                                onBlur={() => setBioFocused(false)}
                                onFocus={() => setBioFocused(true)}
                                onChange={(e) => setBio(e.target.value)}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </div>
                </div>
                <StyledButton
                    style={{marginTop: '32px', height: '36px', textTransform: 'none'}}
                    onClick={() => save()}
                    variant="contained"
                    color="primary">
                    Save
                </StyledButton>
            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
