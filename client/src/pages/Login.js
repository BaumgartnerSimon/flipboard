import React from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Card from "@material-ui/core/Card";
import Background from '../assets/travel.jpg';
import {Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            displayRegister: false,
            success: false,
            error: false,
            message: "",
        }
    }

    handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({error: false});
        this.setState({success: false});
    };

    setMessage= (message) => {
        this.setState({message: message})
    }

    setSuccess = (success) => {
        this.setState({success: success})
    }

    setError = (error) => {
        this.setState({error: error})
    }

    setDisplayRegister= (bool) => {
        this.setState({displayRegister: bool})
    }

    render() {
        const vertical = 'top';
        const horizontal = 'center';
        return (
            <div style={{display: "flex",alignItems: 'center', justifyContent: "center", height: '100vh', backgroundImage: `url(${Background})`}}>
                <div style={{flexDirection: 'column', display: "flex",alignItems: 'center', justifyContent: "center"}}>
                    <Card style={{borderRadius: '6px', backgroundColor: 'white'}}>
                        {!this.state.displayRegister && (
                            <LoginForm setMessage={this.setMessage} setError={this.setError} setSuccess={this.setSuccess} setDisplayRegister={this.setDisplayRegister} />
                        )}
                        {this.state.displayRegister && (
                            <RegisterForm setMessage={this.setMessage} setError={this.setError} setSuccess={this.setSuccess} setDisplayRegister={this.setDisplayRegister} />
                        )}
                    </Card>
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
        );
    }
}
