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
            emailLoading: false,
            skillsLoading: false,
            passwordLoading: false,
            username: this.props.user.username,
            email: "",
            oldPassword: "",
            newPassword: "",
            skills: ""
        };
    }

    async componentDidMount() {
        this.props.user.attributes.map( (attribute) => {
            if (attribute.Name === "email") this.setState({email: attribute.Value});
            if (attribute.Name === "custom:skills") this.setState({skills: attribute.Value});
        });
    }

    handleCheckbox = event => {
        this.setState({changePassword: !this.state.changePassword});
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleSubmitEmail = async event => {
        await this.handleSubmit(event, true);
    };

    handleSubmitSkills = async event => {
        await this.handleSubmit(event, false);
    };

    handleSubmit = async (event, email) => {
        event.preventDefault();

        try {
            const input = {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    AccessToken: this.props.user.auth.AccessToken,
                    UserAttributes: [
                        {
                            Name: "",
                            Value: ""
                        }
                    ]
                }
            };
            if (email) {
                this.setState({emailLoading: true});
                input.body.UserAttributes.Name = "email";
                input.body.UserAttributes.Value = this.state.email;
            } else {
                this.setState({skillsLoading: true});
                input.body.UserAttributes.Name = "custom:skills";
                input.body.UserAttributes.Value = this.state.email;
            }
            await API.put("projects", "/users", input);
        } catch (error) {
            this.setState({
                emailLoading: false,
                skillsLoading: false
            });
            console.error(error.response);
        }

        this.setState({
            emailLoading: false,
            skillsLoading: false
        });
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
                        <FormGroup>
                            <ControlLabel>Username:</ControlLabel>
                            <OverlayTrigger placement="bottom"
                                            overlay={usernameTooltip}>
                                <FormControl value={this.state.username}
                                             disabled={true} />
                            </OverlayTrigger>
                        </FormGroup>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Form inline onSubmit={this.handleSubmit}>
                            <FormGroup controlId="email">
                                <ControlLabel>Email</ControlLabel>{": "}
                                <FormControl value={this.state.email}
                                             onChange={this.handleChange} />
                            </FormGroup>
                            <LoadingButton type="submit"
                                           isLoading={this.state.emailLoading}
                                           text="Submit changes"
                                           loadingText="Submitting..." />
                        </Form>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Form inline onSubmit={this.handleSubmitSkills}>
                            <FormGroup controlId="skills">
                                <ControlLabel>Skills</ControlLabel>{": "}
                                <FormControl value={this.state.skills}
                                             onChange={this.handleChange} />
                                {
                                    // TODO: make changing (and adding) skills UI similar to the one for adding developers
                                    // to a new project
                                }
                            </FormGroup>
                            <LoadingButton type="submit"
                                           isLoading={this.state.skillsLoading}
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