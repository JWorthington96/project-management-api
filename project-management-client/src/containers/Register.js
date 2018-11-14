import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox} from "react-bootstrap";
import "./Register.css";
import {Auth} from "aws-amplify";
import LoadingButton from "../components/LoadingButton";

export default class Register extends Component {
    constructor(props, context){
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isConfirmed: false,
            isLoading: false,
            email: '',
            username: '',
            password: '',
            confirmPass: '',
            newUser: null
        };
    }

    getValidationState() {
        const emailLen = this.state.email.length;
        const userLen = this.state.username.length;
        const passLen = this.state.password.length;
        if (emailLen > 0 && userLen > 0 && passLen > 12 &&
            this.state.confirmPass === this.state.password) return 'success';
        else return 'error';
    }

    getValidationBoolean(){
        if (this.getValidationState() === 'success') return true;
        else return false;
    }

    handleChange(event){
        this.setState({[event.target.id]: event.target.value})
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({isLoading: true});
        try {
            const newUser = await Auth.signUp({
                username: this.state.username,
                password: this.state.password,
                attributes: {email: this.state.email}
            });
            this.props.changeCurrentUser(newUser);
            this.setState({newUser});
        } catch (e) {
            alert(e.message);
        }

        this.setState({isLoading: false});
    }

    renderConfirmation() {
        return (
            <div className="confirmation">
                <h1>Thank you for registering!</h1>
                <h3>Please check your email to confirm your account before signing in</h3>
            </div>
        );
    }

    renderForm() {
        return(
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl autoFocus
                                 type="email"
                                 value={this.state.email}
                                 onChange={this.handleChange}
                                 placeholder="john.doe@example.com"
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId="username">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl type="username"
                                 value={this.state.username}
                                 onChange={this.handleChange}
                                 placeholder="xXexampleXx" />
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
                    <HelpBlock>Password must be at least 12 characters long</HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="confirmPass"
                    validationState={this.getValidationState()}
                >
                    <ControlLabel>Confirm password</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.confirmPass}
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Must match password</HelpBlock>
                </FormGroup>

                <Checkbox title="The website will save your credentials to immediately login">
                    Remember details
                </Checkbox>

                <LoadingButton
                    type="submit"
                    disabled={!this.getValidationBoolean()}
                    isLoading={this.state.isLoading}
                    text="Register"
                    loadingText="Registering..."
                />
            </form>
        );
    }

    render() {
        return(
            <div className="Register">
                {this.state.newUser == null ? this.renderForm() : this.renderConfirmation()}
            </div>
        );
    }
}