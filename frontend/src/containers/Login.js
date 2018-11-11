import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox} from "react-bootstrap/es";
import {Button} from "react-bootstrap";
import "./Login.css";
import {Auth} from "aws-amplify";

export default class Login extends Component {
    constructor(props, context){
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            username: '',
            password: ''
        };
    }

    getValidationState() {
        const emailLen = this.state.username.length;
        const passLen = this.state.password.length;
        if (emailLen > 0 && passLen > 12) return 'success';
        else return 'error';
    }

    getValidationBoolean(){
        if (this.getValidationState() == 'success') return true;
        else return false;
    }

    handleChange(e){
        this.setState({[e.target.id]: e.target.value});
    }

    handleSubmit = async e => {
        e.preventDefault();

        try {
            await Auth.signIn(this.state.username, this.state.password);
            alert("Logged in");
            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (error) {
            alert(error.message);
        }
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup
                        controlId="username"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            type="username"
                            placeholder="Your username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                        controlId="password"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Password is at least 12 characters long</HelpBlock>
                    </FormGroup>

                    <Checkbox title="The website will save your credentials to immediately login next time">
                        Remember details
                    </Checkbox>

                    <Button type="submit"
                            disabled={!this.getValidationBoolean()}>
                        Login
                    </Button>
                </form>
                <div>

                </div>
            </div>
        );
    }
}