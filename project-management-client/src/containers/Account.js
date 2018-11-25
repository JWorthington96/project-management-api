import React, {Component} from "react";
import {Checkbox, ControlLabel, Form, FormGroup, FormControl, ListGroup, ListGroupItem,
        OverlayTrigger, Tooltip} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import {Auth} from "aws-amplify";

export default class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            changePassword: false,
            isLoading: false,
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
                                <FormControl value={this.state.skills}
                                             onChange={this.handleChange} />
                                // TODO: make changing (and adding) skills UI similar to 
                            <h3>Email: {this.state.email}</h3>
                            <h3>Skills: {this.state.skills}</h3>
                        </Form>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Checkbox onChange={this.handleCheckbox}>Change password</Checkbox>
                        {this.state.changePassword ?
                            <Form inline onSubmit={this.handleSubmitPassword}>
                                <FormGroup controlId="oldPassword"
                                           validationState={this.getValidationState()} >
                                    <ControlLabel>Old password:</ControlLabel>
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <FormControl type="password"
                                                     value={this.state.oldPassword}
                                                     onChange={this.handleChange} />
                                    </OverlayTrigger>
                                    <FormControl.Feedback />
                                </FormGroup>
                                <FormGroup controlId="newPassword"
                                           validationState={this.getValidationState()} >
                                    <ControlLabel>New password:</ControlLabel>
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <FormControl type="password"
                                                     value={this.state.newPassword}
                                                     onChange={this.handleChange} />
                                    </OverlayTrigger>
                                    <FormControl.Feedback />
                                </FormGroup>
                                <LoadingButton type="submit"
                                               disabled={!this.getValidationBoolean}
                                               isLoading={this.state.isLoading}
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