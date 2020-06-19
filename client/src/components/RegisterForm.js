import React from 'react';
import {Button, Divider, TextField, Typography, withStyles} from "@material-ui/core";
import '../styles/Register.css'
import Link from "@material-ui/core/Link";
import axios from "axios";

const StyledButton = withStyles({
    root: {
        color: 'white',
        display: 'flex',
        textTransform: 'none',
        background: "#F52828",
        '&:hover': {
            background: "#E00A0A",
        },
    },
})(Button);

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            cPassword: "",
        }
    }

    handleButtonClick = () => {
        this.register();
    };

    register() {
        axios.post('http://localhost:5000/register', {
            username: this.state.username,
            password: this.state.password
        }, {})
            .then(res => {
                console.log("RESPONSE GET BOARD", res.data)
                if (res.data.success) {
                    this.props.setSuccess(true);
                    this.props.setMessage(res.data.message);
                    this.props.setDisplayRegister(false);
                } else {
                    this.props.setError(true);
                    this.props.setMessage(res.data.message);
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    render() {
        const formValid = (this.state.username !== "" && this.state.password !== "" && this.state.cPassword === this.state.password)

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
                    <Typography variant="h6" gutterBottom style={{fontFamily: 'HelveticaNeueBold', fontSize: '22px', fontWeight: 'bold', color: "black", display: "flex", justifyContent: "center"}}>
                        JOIN FLIPBOARD
                    </Typography>
                    <TextField
                        required
                        className="textField"
                        style={{width: '312px', marginTop: "8px", marginBottom: "8px"}}
                        id="nameRegister"
                        label="Enter username"
                        variant="outlined"
                        autoFocus
                        value={this.state.username}
                        onChange={(sender) => this.setState({username: sender.target.value})}
                    />
                    <TextField
                        required
                        className={"textField"}
                        style={{width: '312px', marginTop: "8px", marginBottom: "8px"}}
                        id="standard-password-input"
                        type="password"
                        variant="outlined"
                        label="Create password"
                        value={this.state.password}
                        onChange={(sender) => this.setState({password: sender.target.value})}
                    />
                    <TextField
                        required
                        className={"textField"}
                        style={{width: '312px', marginTop: "8px", marginBottom: "8px"}}
                        id="standard-confirm-password-input"
                        type="password"
                        variant="outlined"
                        label="Confirm password"
                        value={this.state.cPassword}
                        onChange={(sender) => this.setState({cPassword: sender.target.value})}
                    />
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <StyledButton
                            disabled={!formValid}
                            color="primary"
                            variant="contained"
                            style={{ fontSize: '20px', width: '360px', height: '50px', marginTop: "20px", marginBottom: "20px"}}
                            onClick={() =>  {
                                this.handleButtonClick();
                            }}
                        >
                            Sign Up
                        </StyledButton>
                    </div>
                    <Divider variant={"middle"}/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Typography style={{marginTop: "20px"}}>
                            Already have an account ?
                            <Link style={{marginLeft: '5px'}} onClick={() => this.props.setDisplayRegister(false)} color="inherit">
                                Log In
                            </Link>
                        </Typography>
                    </div>
                </div>
            </div>

        );
    }
}
