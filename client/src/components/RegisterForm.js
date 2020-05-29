import React from 'react';
import {Button, CircularProgress, Divider, Snackbar, TextField, Typography, withStyles} from "@material-ui/core";
import MuiAlert  from '@material-ui/lab/Alert';
import '../styles/Register.css'
import Link from "@material-ui/core/Link";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
            success: false,
            error: false,
            message: "",
        }
    }

    handleButtonClick = () => {
        this.props.setDisplayRegister(false);
    };

    render() {
        const vertical = 'top'
        const horizontal = 'center'
        const formValid = (this.state.username !== "" && this.state.password !== "" && this.state.cPassword === this.state.password)

        return (
            <div style={{ width: "40vh", margin: "20px"}}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{display: 'flex', justifyContent: "center", marginBottom: '20px'}}>
                        <img src="./logoFlip.png" />
                    </div>
                    <Typography variant="h6" gutterBottom style={{fontWeight: 'bold', color: "black", display: "flex", justifyContent: "center"}}>
                        JOIN FLIPBOARD
                    </Typography>
                    <TextField
                        required
                        className="textField"
                        style={{marginTop: "8px", marginBottom: "8px"}}
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
                        style={{marginTop: "8px", marginBottom: "8px"}}
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
                        style={{marginTop: "8px", marginBottom: "8px"}}
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
                    <Snackbar anchorOrigin={{vertical, horizontal}} open={this.state.success} autoHideDuration={6000} onClose={this.handleClose}>
                        <Alert onClose={this.handleClose} severity="success">
                            {this.state.message}
                        </Alert>
                    </Snackbar>
                    <Snackbar anchorOrigin={{vertical, horizontal}} open={this.state.error} autoHideDuration={6000} onClose={this.handleClose}>
                        <Alert onClose={this.handleClose} severity="error">
                            {this.state.message}
                        </Alert>
                    </Snackbar>
                </div>
            </div>

        );
    }
}
