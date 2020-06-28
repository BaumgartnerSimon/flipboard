import React from 'react'
import {Menu, MenuItem, Divider} from '@material-ui/core'
import {withRouter} from "react-router-dom";
import axios from "axios";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    customWidth: {
        '& div': {
            // this is just an example, you can use vw, etc.
            borderRadius: '0',
        }
    }
});

function TopBarProfile(props) {
    const classes = useStyles();

    const logout = () => {
        axios.post('http://localhost:5000/logout', {
        }, {})
            .then(res => {
                console.log("RESPONSE GET BOARD", res.data)
                if (res.data.success) {
                    localStorage.setItem("id", "");
                    props.history.push("/login")
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <div>
            <Menu
                id="simple-menu"
                anchorEl={props.anchorEl}
                className={classes.customWidth}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
                style={{marginTop: '45px', marginLeft:'20px'}}
            >
                <MenuItem style={{width: '150px', paddingTop: '10px', paddingBottom: '10px'}} onClick={() => {
                    props.handleMenuClick();
                    props.handleClose();
                    props.history.push('/profile', {})}
                }>
                    Profile
                </MenuItem>
                <Divider />
                <MenuItem style={{paddingTop: '10px', paddingBottom: '10px'}} onClick={() => {
                    props.handleMenuClick();
                    props.handleClose();
                    props.history.push('/settings', {})}
                }>
                    Settings
                </MenuItem>
                <Divider />
                <MenuItem style={{paddingTop: '10px', paddingBottom: '10px'}}
                          onClick={() => {
                              props.handleClose();
                              logout();
                          }}>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    )
}

export default withRouter(TopBarProfile)
