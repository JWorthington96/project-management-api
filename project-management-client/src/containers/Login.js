import React, {Component, Fragment} from "react";
import {Alert, Button, ControlLabel, FormGroup, FormControl, HelpBlock} from "react-bootstrap";
import "./Login.css";
import {API} from "aws-amplify";
import LoadingButton from "../components/LoadingButton";

export default class Login extends Component {
    constructor(props, context){
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isConfirmed: true,
            isLoading: false,
            incorrect: false,
            username: '',
            password: ''
        };
    }

    getValidationBoolean() {
        const usernameLen = this.state.username.length;
        const passLen = this.state.password.length;
        return (usernameLen > 0 && passLen > 12);
    };

    getValidationState(){
        return this.getValidationBoolean() ? 'success' : 'error';
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({isLoading: true});

        try {
            const response = await API.post("projects", "/login", {body: {
                    Username: this.state.username,
                    Password: this.state.password
                }
            });
            const user = {
                username: this.state.username,
                password: this.state.password,
                auth: response.body.Auth,
                identityId: response.body.IdentityId
            };
            localStorage.setItem("ProjectManagerSession", JSON.stringify(user));
            this.props.userHasAuthenticated(true);
            // this will store the user in App.js
            this.props.setCurrentUser(user);
            console.log(user.valueOf());
            this.setState({isLoading: false});
            this.props.history.push("/");
        } catch (error) {
            if (error.message === "") {
                this.setState({isConfirmed: false});
            } else if (error.message === "No username/password combination found") {
                this.setState({incorrect: true});
                // TODO: add prompt that shows the username or pass was incorrect
            } else if (error.message === "User does not exist.") {
                // TODO: redirect user to the register page
            } else {
                console.log(error);
            }
        }
    };

    handleDismiss = event => {
        this.setState({isConfirmed: true});
    };

    handleResend = async event => {
        event.preventDefault();

        try {
            //await Auth.resendSignUp(this.state.username);
            this.setState({isConfirmed: true});
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const tooltip = (
            <Tooltip id="tooltip">
                Password must be at least <strong>12 characters</strong>, contain at least
                <strong>one capital and symbol</strong>.
            </Tooltip>
        );

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
                        <OverlayTrigger placement="bottom" overlay={tooltip}>
                            <FormControl
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </OverlayTrigger>
                        <FormControl.Feedback />
                    </FormGroup>

                    <LoadingButton
                        type="submit"
                        disabled={!this.getValidationBoolean()}
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in..."
                    />

                    {this.state.isConfirmed ? null
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