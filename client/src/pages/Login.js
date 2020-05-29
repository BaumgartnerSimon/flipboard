import React from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Card from "@material-ui/core/Card";
import Background from '../assets/travel.jpg';

export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            displayRegister: false
        }
    }

    setDisplayRegister= (bool) => {
        this.setState({displayRegister: bool})
    }

    render() {
        return (
            <div style={{display: "flex",alignItems: 'center', justifyContent: "center", height: '100vh', backgroundImage: `url(${Background})`}}>
                <div style={{flexDirection: 'column', display: "flex",alignItems: 'center', justifyContent: "center"}}>
                    <Card style={{borderRadius: '6px', backgroundColor: 'white'}}>
                        {!this.state.displayRegister && (
                            <LoginForm setDisplayRegister={this.setDisplayRegister} />
                        )}
                        {this.state.displayRegister && (
                            <RegisterForm setDisplayRegister={this.setDisplayRegister} />
                        )}
                    </Card>
                </div>
            </div>
        );
    }
}
