import React, {Component, Fragment} from "react";
import {Alert, Button, FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox} from "react-bootstrap";
import "./Login.css";
import {Auth} from "aws-amplify";
import LoadingButton from "../components/LoadingButton";

export default class Login extends Component {
    constructor(props, context){
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isConfirmed: true,
            isLoading: false,
            username: '',
            password: ''
        };
    }

    getValidationState() {
        const usernameLen = this.state.username.length;
        const passLen = this.state.password.length;
        if (usernameLen > 0 && passLen > 12) return 'success';
        else return 'error';
    }

    getValidationBoolean(){
        if (this.getValidationState() === 'success') return true;
        else return false;
    }

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({isLoading: true});
        try {
            let user = await Auth.signIn(this.state.username, this.state.password);
            this.props.userHasAuthenticated(true);
            // this will store the user in App.js
            this.props.changeCurrentUser(user);
            this.setState({isLoading: false});
            this.props.history.push("/");
        } catch (error) {
            if (error.message === "User is not confirmed.") {
                this.setState({isConfirmed: false});
            } else if (error.message === "") {
                // TODO: notify user if credentials are wrong
            } else if (error.message === "User does not exist.") {
                // TODO: redirect user to the register page
            } else {
                console.log(error);
            }
        }
    }

    handleDismiss = event => {
        this.setState({isConfirmed: true});
    }

    handleResend = async event => {
        event.preventDefault();

        try {
            await Auth.resendSignUp(this.state.username);
            this.setState({isConfirmed: true});
        } catch (error) {
            console.log(error);
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

                    <LoadingButton
                        type="submit"
                        disabled={!this.getValidationBoolean()}
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in..."
                    />

                    {this.state.isConfirmed ? <div></div>
                        : <Fragment>
                            <Alert className="alert" bsStyle="danger" onDismiss={this.handleDismiss}>
                                <h3>Thank you again for registering!</h3>
                                <p>Unfortunately you still haven't confirmed your account. Please check your email to confirm your
                                    account before signing in, alternatively, if that doesn't work or you lost the email,
                                    click the button below to resend the confirmation email.</p>
                                <p>
                                    <Button onClick={this.handleResend}>Resend email</Button>
                                    <span>  or  </span>
                                    <Button onClick={this.handleDismiss}>Dismiss</Button>
                                </p>
                            </Alert>
                        </Fragment>}
                </form>
            </div>
        );
    }
}