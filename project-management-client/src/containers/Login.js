import React, {Component, Fragment} from "react";
import {
    Alert,
    Button,
    ControlLabel,
    FormGroup,
    FormControl,
    OverlayTrigger,
    Tooltip,
    Form,
    Modal
} from "react-bootstrap";
import "./Login.css";
import {API} from "aws-amplify";
import LoadingButton from "../components/LoadingButton";

export default class Login extends Component {
    constructor(props, context){
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isLoading: false,
            isConfirmLoading: false,
            showConfirm: false,
            incorrect: false,
            username: '',
            password: '',
            code: ''
        };
    }

    getValidationBoolean() {
        const usernameLen = this.state.username.length;
        const passLen = this.state.password.length;
        return (usernameLen > 0 && passLen > 8);
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
            // calling the sign in and get user methods on the backend
            const response = (await API.post("projects", "/login", {body: {
                    Username: this.state.username,
                    Password: this.state.password
                }
            })).body;
            //console.log(response);

            const attributes = (await API.get("projects", "/users", {
                headers: {
                    Authorization: "Bearer " + response.AccessToken
                }
            })).body;
            //console.log(attributes);

            const user = {
                username: this.state.username,
                password: this.state.password,
                attributes: attributes.UserAttributes,
                auth: response
            };

            let admin = false;
            user.attributes.map( (attribute) => {
                if (attribute.Name === "custom:admin") admin = true;
            });
            user.admin = admin;

            // calculating the clock drift from the server
            user.auth.ClockDrift = Math.floor(new Date()/1000) - user.auth.IssuedAt;

            localStorage.setItem("ProjectManagerSession", JSON.stringify(user));
            this.props.userHasAuthenticated(true);
            // this will store the user in App.js for use in the site
            await this.props.setCurrentUser(user);
            this.props.history.push('/');
        } catch (error) {
            if (error.response.data.body.message === "User is not confirmed.") {
                this.setState({
                    isLoading: false,
                    showConfirm: true
                });
            } else if (error.response.data.body.code === "NotAuthorizedException") {
                this.setState({
                    isLoading: false,
                    incorrect: true
                });
                // TODO: add prompt that shows the username or pass was incorrect
            } else if (error.message === "User does not exist.") {
                this.props.history.push('/register');
            } else {
                console.error(error.response);
                this.setState({isLoading: false});
            }
        }
    };

    handleDismiss = (event, password) => {
        if (password) {
            this.setState({incorrect: false})
        } else {
            this.setState({isConfirmed: true});
        }
    };

    handleResend = async event => {
        event.preventDefault();

        try {
            await API.post("projects", "register/resend", {
                Username: this.state.username
            });
        } catch (error) {
            console.error(error);
        }
    };

    handleConfirmSubmit = async event => {
        event.preventDefault();
        this.setState({isConfirmLoading: true});

        try {
            await API.post("projects", "/register/confirm", {body: {
                    Username: this.state.username,
                    ConfirmationCode: this.state.code
                }
            });

            alert("Successfully confirmed email! You can now log in.");
            this.setState({
                showConfirm: false,
                isConfirmLoading: false
            });
        } catch (error) {
            console.error(error.response);
            this.setState({isConfirmLoading: false});
        }
    };

    handleHide = event => {
        this.setState({showConfirm: false});
    };

    renderAlert(){
        return(
            <Alert className="alert" bsStyle="danger" onDismiss={(event) => this.handleDismiss(event, true)}>
                <h3>Incorrect username or password</h3>
                <p>
                    No username/password combination found, please make sure you have entered the correct details
                    (username and password are both case sensitive).
                </p>
                <Button onClick={(event) => this.handleDismiss(event, true)}>Dismiss</Button>
            </Alert>
        );
    }

    render() {
        const tooltip =
            <Tooltip id="password-tooltip">
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

                    {!this.state.showConfirm ? null
                        : <Fragment>
                            <Alert className="alert" bsStyle="danger" onDismiss={this.handleDismiss}>
                                <h3>Thank you again for registering!</h3>
                                <p>Unfortunately you still haven't confirmed your account. Please check your email to
                                    find the code to confirm your account before signing in, alternatively, if that
                                    doesn't work or you lost the email, click the button below to resend the
                                    confirmation email.</p>
                                <Form onSubmit={this.handleConfirmSubmit}>
                                    <FormGroup controlId="code">
                                        <ControlLabel>Code:</ControlLabel>
                                        <FormControl value={this.state.code}
                                                     onChange={this.handleChange} />
                                    </FormGroup>
                                    <LoadingButton type="submit"
                                                   isLoading={this.state.isConfirmLoading}
                                                   text="Confirm"
                                                   loadingText="Confirming..." />
                                </Form>
                                <br/>
                                <p>
                                    <Button onClick={this.handleResend}>Resend email</Button>
                                    <span>  or  </span>
                                    <Button onClick={this.handleDismiss}>Dismiss</Button>
                                </p>
                            </Alert>
                        </Fragment>}
                    {this.state.incorrect ? this.renderAlert() : null}
                </form>
            </div>
        );
    }
}