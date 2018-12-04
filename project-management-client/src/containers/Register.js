import React, {Component} from "react";
import {ControlLabel, Form, FormGroup, FormControl, HelpBlock, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import "./Register.css";
import {API} from "aws-amplify";

export default class Register extends Component {
    constructor(props, context){
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isConfirmed: false,
            isLoading: false,
            isConfirmLoading: false,
            showConfirm: false,
            email: '',
            skills: '',
            username: '',
            password: '',
            confirmPass: '',
            code: '',
            newUser: {}
        };
    }

    getValidationState() {
        const emailLen = this.state.email.length;
        const userLen = this.state.username.length;
        const passLen = this.state.password.length;
        if (emailLen > 0 && userLen > 0 && passLen > 8 &&
            this.state.confirmPass === this.state.password) return 'success';
        else return 'error';
    }

    getValidationBoolean(){
        return this.getValidationState() === 'success';
    }

    handleChange(event){
        this.setState({[event.target.id]: event.target.value})
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({isLoading: true});
        try {
            const newUser = {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                skills: this.state.skills
            };
            await API.post("projects", "/register", {body: {
                    Username: newUser.username,
                    Password: newUser.password,
                    Email: newUser.email,
                    Skills: newUser.skills
                }
            });

            this.setState({
                newUser: newUser,
                showConfirm: true
            });
        } catch (error) {
            if (error.response.data.body === "Password did not conform with password policy.")
                alert("Password must have a lower case, upper case, symbol and number.");
            else if (error.response.data.body === "User already exists") alert("ERROR: username is already taken.");
            else {
                console.error(error.response);
                this.setState({isLoading: false});
            }
        }
    };

    handleConfirmSubmit = async event => {
        event.preventDefault();
        this.setState({isConfirmLoading: true});
        //console.log(this.state.newUser);

        try {
            await API.post("projects", "/register/confirm", {body: {
                    Username: this.state.newUser.username,
                    ConfirmationCode: this.state.code
                }
            });

            alert("Successfully confirmed email! You can now log in.");
            this.props.history.push('/login');
        } catch (error) {
            console.error(error.response);
            this.setState({isConfirmLoading: false});
        }
    };

    handleHide = event => {
        this.setState({showConfirm: false});
    };

    render() {
        const tooltip =
            <Tooltip>
                Password must be at least 8 characters long with an upper case, lower case, number and symbol.
            </Tooltip>;

        return(
            <div>
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

                    <FormGroup
                        controlId="confirmPass"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Confirm password</ControlLabel>
                        <FormControl
                            type="password"
                            value={this.state.confirmPass}
                            onChange={this.handleChange} />
                        <FormControl.Feedback />
                        <HelpBlock>Must match password</HelpBlock>
                    </FormGroup>

                    <FormGroup controlId="skills">
                        <ControlLabel>Skills</ControlLabel>
                        <FormControl value={this.state.skills}
                                     onChange={this.handleChange} />
                        <HelpBlock>Enter all your relevant skills, separated by commas</HelpBlock>
                    </FormGroup>

                    <LoadingButton
                        type="submit"
                        disabled={!this.getValidationBoolean()}
                        isLoading={this.state.isLoading}
                        text="Register"
                        loadingText="Registering..."
                    />
                </form>

                <Modal show={this.state.showConfirm}
                       onHide={this.handleHide} >
                    <Form onSubmit={this.handleConfirmSubmit}>
                        <Modal.Header>
                            Confirm your username.
                        </Modal.Header>
                        <Modal.Body>
                            Please enter the confirmation code sent to your email below:
                            <FormGroup controlId="code">
                                <ControlLabel>Code:</ControlLabel>
                                <FormControl value={this.state.code}
                                             onChange={this.handleChange} />
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <LoadingButton type="submit"
                                           isLoading={this.state.isConfirmLoading}
                                           text="Confirm"
                                           loadingText="Confirming..."
                            />
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        );
    }
}