import React, {Component} from "react";
import {Checkbox, ControlLabel, Form, FormGroup, FormControl, ListGroup, ListGroupItem} from "react-bootstrap";
import {API} from "aws-amplify";
import "./NewProject.css";
import DynamicDeveloperForm from "../components/DynamicDeveloperForm";
import LoadingButton from "../components/LoadingButton";

export default class NewProject extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            isSubmitting: false,
            confirmDevelopers: true,
            userIsManager: true,
            siteUsers: [],
            title: "",
            description: "",
            projectManager: this.props.user.username,
            developers: [],
            projectRoles: ["Project Manager", "Developer"]
        };

        this.setDevelopers = this.setDevelopers.bind(this);
        this.confirmDevelopers = this.confirmDevelopers.bind(this);
    }

    async componentDidMount() {
        try {
            const users = await API.get("projects", "/users/list", {
                headers: {
                    Authorization: this.props.user.auth.AccessToken
                }
            });

            let siteUsers = [];
            users.map( (user) => {
                siteUsers.push(user.Username);
            });
            console.log(siteUsers);
            this.setState({siteUsers: siteUsers});
        } catch (error) {
            console.error(error.response);
        }
        this.setState({isLoading: false});
    };

    validateForm(){
        return this.state.title.length !==0 && this.state.description.length !== 0
            && this.state.projectManager.length !== 0 && this.state.confirmDevelopers;
    };

    setDevelopers(developers) {
        this.setState({developers: developers});
    };

    confirmDevelopers = boolean => {
        this.setState({confirmDevelopers: boolean});
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleToggle = event => {
        this.setState({userIsManager: !this.state.userIsManager});
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isSubmitting: true});

        let users = [];
        for (let i = 0; i < this.state.developers.length; i++){
            users.push(this.state.developers[i]);
        }
        if (this.state.userIsManager) users.push({username: this.state.projectManager});

        try {
            const project = await this.createProject({
                identityId: this.props.user.identityId,
                title: this.state.title,
                projectManager: this.state.projectManager,
                description: this.state.description,
                projectRoles: this.state.projectRoles,
                users: users
            });
            console.log(project);
            //await this.createDefaultRoles(project.projectId);
            this.props.history.push("/");
        } catch (error) {
            console.error(error.response);
            this.setState({isSubmitting: false});
        }
    };

    createProject(project) {
        return API.post("projects", "/projects", {
            headers: {
                Authorization: "Bearer " + this.props.user.auth.AccessToken
            },
            body: project
        });
    }

    createDefaultRoles(projectId) {
        // remove spaces
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
                {!this.state.isLoading ?
                    <ListGroup>
                        <ListGroupItem>
                            <Form inline onSubmit={this.handleSubmit}>
                                <FormGroup controlId="title">
                                    <ControlLabel>Title of project</ControlLabel>{': '}
                                    <FormControl onChange={this.handleChange} value={this.state.title}/>
                                </FormGroup>

                                <FormGroup controlId="description">
                                    <ControlLabel>Brief description</ControlLabel>{': '}
                                    <FormControl onChange={this.handleChange}
                                                 value={this.state.description}
                                                 componentClass="textarea"/>
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

                                <FormGroup>
                                    <LoadingButton type="submit"
                                                   isLoading={this.state.isSubmitting}
                                                   text="Create"
                                                   loadingText="Creating..."
                                                   disabled={!this.validateForm()}/>
                                </FormGroup>
                            </Form>
                        </ListGroupItem>

                        <ListGroupItem>
                            <h4>*OPTIONAL* Add known developers</h4>
                            <DynamicDeveloperForm setDevelopers={this.setDevelopers}
                                                  confirmDevelopers={this.confirmDevelopers}
                                                  name={this.state.title}
                                                  description={this.state.description}
                                                  projectManager={this.state.projectManager}/>
                        </ListGroupItem>
                    </ListGroup>
                    :
                    <h2>Loading...</h2>
                }
            </div>
        );
    }
}