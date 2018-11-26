import React, {Component} from "react";
import {Checkbox, ControlLabel, Form, FormGroup, FormControl, HelpBlock, ListGroup, ListGroupItem,
        OverlayTrigger, Tooltip} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import {Auth, API} from "aws-amplify";

export default class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            changePassword: false,
            isLoading: false,
            attributesLoading: false,
            passwordLoading: false,
            username: this.props.user.username,
            email: this.props.user.attributes.email,
            oldPassword: "",
            newPassword: "",
            skills: this.props.user.attributes.skills
        };
    }

    handleCheckbox = event => {
        this.setState({changePassword: !this.state.changePassword});
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleChangeSkills = event => {
        const skills = event.target.value.split(', ');
        this.setState({skills: skills});
    };

    handleSubmit = async event => {
        event.preventDefault();

        try {
            await API.post("projects", "/users", {
                headers: {
                    Authorization: this.props.user.auth.AccessToken
                },
                body: {
                    AccessToken: this.props.user.auth.AccessToken,
                    Email: this.state.email,
                    Skills: this.state.skills
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    handleSubmitPassword = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        try {
            await Auth.changePassword(this.props.user, this.state.oldPassword, this.state.newPassword);
        } catch (error) {
            console.log(error);
        }

        this.setState({isLoading: false});
    };

    getValidationBoolean() {
        const oldLen = this.state.oldPassword.length;
        const newLen = this.state.newPassword.length;
        return (oldLen > 12 && newLen > 12);
    }

    getValidationState() {
        return this.getValidationBoolean() ? 'success' : 'error';
    }

    render() {
        const usernameTooltip = (
            <Tooltip id="usernameTooltip">
                Cannot change username.
            </Tooltip>
        );
        const passwordTooltip = (
            <Tooltip id="passwordTooltip">
                Password must be at least <strong>12 characters</strong>, contain at least
                <strong>one capital and symbol</strong>.
            </Tooltip>
        );

        return (
            <div className="Account">
                <ListGroup>
                    <ListGroupItem>
                        <h3>Username: {this.state.username}</h3>
                        <HelpBlock>Cannot change username</HelpBlock>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <ControlLabel>Username:</ControlLabel>
                                <OverlayTrigger placement="bottom"
                                                overlay={usernameTooltip}>
                                    <FormControl value={this.state.username}
                                                 disabled={true} />
                                </OverlayTrigger>
                            </FormGroup>
                            <FormGroup controlId="email">
                                <ControlLabel>Email:</ControlLabel>
                                <FormControl value={this.state.email}
                                             onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup controlId="skills">
                                <ControlLabel>Skills:</ControlLabel>
                                <FormControl value={this.state.skills.join(', ')}
                                             onChange={this.handleChangeSkills} />
                                // TODO: make changing (and adding) skills UI similar to the one for adding developers
                                // to a new project
                            </FormGroup>
                            <LoadingButton type="submit"
                                           isLoading={this.state.attributesLoading}
                                           text="Submit changes"
                                           loadingText="Submitting..." />
                        </Form>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Checkbox onChange={this.handleCheckbox}>Change password</Checkbox>
                        {this.state.changePassword ?
                            <Form inline onSubmit={this.handleSubmitPassword}>
                                <FormGroup controlId="oldPassword"
                                           validationState={this.getValidationState()} >
                                    <ControlLabel>Old password:</ControlLabel>
                                    <OverlayTrigger placement="bottom" overlay={passwordTooltip}>
                                        <FormControl type="password"
                                                     value={this.state.oldPassword}
                                                     onChange={this.handleChange} />
                                    </OverlayTrigger>
                                    <FormControl.Feedback />
                                </FormGroup>
                                <FormGroup controlId="newPassword"
                                           validationState={this.getValidationState()} >
                                    <ControlLabel>New password:</ControlLabel>
                                    <OverlayTrigger placement="bottom" overlay={passwordTooltip}>
                                        <FormControl type="password"
                                                     value={this.state.newPassword}
                                                     onChange={this.handleChange} />
                                    </OverlayTrigger>
                                    <FormControl.Feedback />
                                </FormGroup>
                                <LoadingButton type="submit"
                                               disabled={!this.getValidationBoolean}
                                               isLoading={this.state.passwordLoading}
                                               text="Change"
                                               loadingText="Changing..." />
                            </Form>
                            : null }
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}