import React, {Component} from "react";
import {Checkbox, Form, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {API} from "aws-amplify";
import "./NewProject.css";
import DynamicDeveloperForm from "../components/DynamicDeveloperForm";

export default class NewProject extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: null,
            userIsManager: true,
            title: "",
            description: "",
            admin: this.props.user.username,
            projectManager: this.props.user.username,
            developers: [],
            roles: ["Admin", "Project Manager", "Developer"]
        }

        this.setDevelopers = this.setDevelopers.bind(this);
    }

    setDevelopers(developers) {
        this.setState({developers: developers});
    }

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleToggle = event => {
        this.setState({userIsManager: !this.state.userIsManager});
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        try {
            await this.createProject({
                title: this.state.title,
                description: this.state.description,
                admin: this.state.admin,
                projectManager: this.state.projectManager,
                developers: this.state.developers
            });
            console.log(this.state.developers);
            this.props.history.push("/");
        } catch (error) {
            alert(error);
            this.setState({isLoading: false});
        }
    };

    createProject(project) {
        return API.post("projects", "/projects", {body: project});
    }

    createDefaultRoles() {
        const adminRole = {
            "RoleName": this.state.title + "Admin",
            "Description": "Access to all DynamoDB actions for project and its users",
            "PolicyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": "logs:CreateLogGroup",
                        "Resource": "*"
                    },
                    {
                        "Effect": "Allow",
                        "Action": [
                            "dynamodb:DeleteItem",
                            "dynamodb:GetItem",
                            "dynamodb:PutItem",
                            "dynamodb:Scan",
                            "dynamodb:UpdateItem"
                        ],
                        "Resource": "arn:aws:dynamodb:" + this.props.user.id + ":" + projectId
                    }
                ]
            }
        }
    }

    render() {
        return (
            <div className="NewProject">
                <Form inline onSubmit={this.handleSubmit}>
                    <FormGroup controlId="title">
                        <ControlLabel>Title of project</ControlLabel>{': '}
                        <FormControl onChange={this.handleChange} value={this.state.title} />
                    </FormGroup>

                    <FormGroup controlId="description">
                        <ControlLabel>Brief description</ControlLabel>{': '}
                        <FormControl onChange={this.handleChange}
                                     value={this.state.description}
                                     componentClass="textarea" />
                    </FormGroup>

                    <FormGroup controlId="projectManager">
                        <ControlLabel>Project Manager</ControlLabel>{': '}
                        <FormControl onChange={this.handleChange}
                                     value={this.state.projectManager}
                                     disabled={this.state.userIsManager}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Checkbox defaultChecked={this.state.userIsManager}
                                  onChange={this.handleToggle}>
                            I'm the project manager
                        </Checkbox>
                    </FormGroup>

                    <DynamicDeveloperForm setDevelopers={this.setDevelopers}
                                          name={this.state.title}
                                          description={this.state.description}
                                          projectManager={this.state.projectManager} />

                </Form>
            </div>
        );
    }
}