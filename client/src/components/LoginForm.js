import React from 'react';
import { withRouter } from 'react-router-dom'
import {Button, CircularProgress, Divider, Snackbar, TextField, Typography, withStyles} from "@material-ui/core";
import MuiAlert  from '@material-ui/lab/Alert';
import '../styles/Login.css'
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

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            success: false,
            error: false,
            message: "",
        }
    }

    handleButtonClick = () => {
        this.props.history.push('/home')
    };

    handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({error: false});
        this.setState({success: false});
    };

    render() {
        const vertical = 'top'
        const horizontal = 'center'
        const formValid = (this.state.username !== "" && this.state.password !== "")

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
                        LOG IN TO FLIPBOARD
                    </Typography>
                    <TextField
                        className={"textField"}
                        id="standard-basic"
                        style={{marginTop: "8px", marginBottom: "8px"}}
                        label="Enter username"
                        variant="outlined"
                        autoFocus
                        value={this.state.username}
                        onChange={(sender) => this.setState({username: sender.target.value})}
                    />
                    <TextField
                        className={"textField"}
                        id="standard-password-input"
                        style={{marginTop: "8px", marginBottom: "8px"}}
                        type="password"
                        variant="outlined"
                        label="Enter password"
                        value={this.state.password}
                        onChange={(sender) => this.setState({password: sender.target.value})}
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

export default withRouter(LoginForm)
