import React from 'react';
import { withRouter } from 'react-router-dom'
import {
    Button,
    Divider,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import '../styles/Login.css'
import Link from "@material-ui/core/Link";
import axios from "axios";

const StyledButton = withStyles({
    root: {
        color: 'white',
        display: 'flex',
        textTransform: 'none',
        background: "#E00A0A",
        '&:hover': {
            background: "#CC0000",
        },
    },
})(Button);


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            success: false,
            usernameFocused: false,
            passwordFocused: false,
            error: false,
            message: "",
        }
    }


    login(id, url) {
        axios.post('http://localhost:5000/login', {
            username: this.state.username,
            password: this.state.password
        }, {})
            .then(res => {
                console.log("RESPONSE GET BOARD", res.data)
                if (res.data.success) {
                    this.props.setSuccess(true);
                    this.props.setMessage(res.data.message);
                    console.log(res.data.unique_login);
                    localStorage.setItem("id", res.data.unique_login);
                    this.props.history.push("/")
                } else {
                    this.props.setError(true);
                    this.props.setMessage(res.data.message);
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    handleButtonClick = () => {
        this.login();
    };

    render() {
        const formValid = (this.state.username !== "" && this.state.password !== "")

        return (
            <div style={{ width: "35vh", margin: "20px"}}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{display: 'flex', justifyContent: "center", marginBottom: '20px'}}>
                        <img alt={"Logo"} src="./logoFlip.png" />
                    </div>
                    <Typography variant="h6" gutterBottom style={{fontFamily: 'HelveticaNeueBold', fontWeight: '900',color: "black", display: "flex", justifyContent: "center"}}>
                        LOG IN TO FLIPBOARD
                    </Typography>
                    <div style={{display: "flex", flexDirection: 'column', alignItems: "center"}}>
                        <TextField
                            className={"textField"}
                            id="standard-basic"
                            style={{width: '312px', marginTop: "8px", marginBottom: "8px"}}
                            label="Enter username"
                            variant="outlined"
                            autoFocus
                            value={this.state.username}
                            onChange={(sender) => this.setState({username: sender.target.value})}
                        />
                        <TextField
                            className={"textField"}
                            id="standard-password-input"
                            style={{width: '312px', marginTop: "8px", marginBottom: "8px"}}
                            type="password"
                            variant="outlined"
                            label="Enter password"
                            value={this.state.password}
                            onChange={(sender) => this.setState({password: sender.target.value})}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <StyledButton
                            disabled={!formValid}
                            color="primary"
                            variant="contained"
                            style={{ fontSize: '20px', width: '312px', height: '50px', marginTop: "20px", marginBottom: "20px"}}
                            onClick={() =>  {
                                this.handleButtonClick();
                            }}
                        >
                            Log In
                        </StyledButton>
                    </div>
                    <Divider variant={"middle"}/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Typography style={{marginTop: "20px"}}>
                            New on Flipboard ?
                            <Link style={{marginLeft: '5px'}} onClick={() => this.props.setDisplayRegister(true)} color="inherit">
                                 Create an account
                            </Link>
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm)
