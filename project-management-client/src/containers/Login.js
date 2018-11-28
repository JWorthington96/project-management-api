import React, {Component, Fragment} from "react";
import {Alert, Button, ControlLabel, FormGroup, FormControl, OverlayTrigger, Tooltip} from "react-bootstrap";
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
            const response = (await API.post("projects", "/login", {body: {
                    Username: this.state.username,
                    Password: this.state.password
                }
            })).body;
            console.log(response);

            const attributes = (await API.get("projects", "/users", {
                headers: {
                    Authorization: "Bearer " + response.AccessToken
                }
            })).body;
            console.log(attributes);

            const user = {
                username: this.state.username,
                password: this.state.password,
                attributes: attributes.UserAttributes,
                auth: response
            };

            // calculating the clock drift from the server
            user.auth.ClockDrift = Math.floor(new Date()/1000) - user.auth.IssuedAt;

            localStorage.setItem("ProjectManagerSession", JSON.stringify(user));
            this.props.userHasAuthenticated(true);
            // this will store the user in App.js
            this.props.setCurrentUser(user);
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
                console.error(error);
                console.error(error.response);
                this.setState({isLoading: false});
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
        const tooltip =
            <Tooltip>
                Password is at least 8 characters long.
            </Tooltip>;

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

                    <OverlayTrigger placement="bottom" overlay={tooltip}>
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
                        </FormGroup>
                    </OverlayTrigger>

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