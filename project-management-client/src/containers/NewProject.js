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
            roles: ["Admin", "Project Manager", "Developer"],
            users: []
        };

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

        let users = this.state.developers.push(this.state.admin);
        if (!this.state.userIsManager) users.push(this.state.projectManager);

        try {
            const project = await this.createProject({
                title: this.state.title,
                description: this.state.description,
                admin: this.state.admin,
                roles: this.state.roles,
                users: this.state.users
            });
            await this.createDefaultRoles(this.projectId);
            console.log(project);
            this.props.history.push("/");
        } catch (error) {
            alert(error);
            this.setState({isLoading: false});
        }
    };

    createProject(project) {
        return API.post("projects", "/projects", {body: project});
    }

    createDefaultRoles(projectId) {
        const title = this.state.title.replace(/\s/g, '');

        const adminRole = {
            RoleName: title + "Admin",
            Description: "Full access of the database",
            DeleteBoolean: true,
            GetBoolean: true,
            PutBoolean: true,
            UpdateBoolean: true
        };
        const projectManagerRole = {
            RoleName: title + "ProjectManager",
            Description: "Full access of the database",
            DeleteBoolean: true,
            GetBoolean: true,
            PutBoolean: true,
            UpdateBoolean: true
        };
        const developerRole = {
            RoleName: title + "Developer",
            Description: "Access to viewing and updating database",
            DeleteBoolean: false,
            GetBoolean: true,
            PutBoolean: true,
            UpdateBoolean: true
        };

        API.post("projects", `/projects/${projectId}/roles`, {body: adminRole}).promise();
        API.post("projects", `/projects/${projectId}/roles`, {body: projectManagerRole}).promise();
        API.post("projects", `/projects/${projectId}/roles`, {body: developerRole}).promise();

        API.post("projects", `/projects/${projectId}/groups`, {body: {
            RoleName: title + "Admin", GroupName: "Admins",
                Description: "Admins have full access of the database"
            }}).promise();
        API.post("projects", `/projects/${projectId}/groups`, {body: {
                RoleName: title + "ProjectManager", GroupName: "ProjectManagers",
                Description: "Project managers have full access of the database"
            }}).promise();
        API.post("projects", `/projects/${projectId}/groups`, {body: {
                RoleName: title + "Developer", GroupName: "Developers",
                Description: "Developers have access to viewing and updating database"
            }}).promise();
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