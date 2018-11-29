import React, {Component} from "react";
import {
    Button,
    ControlLabel,
    DropdownButton,
    Form,
    FormControl,
    FormGroup,
    Glyphicon,
    ListGroup,
    ListGroupItem,
    MenuItem,
    Modal,
    PageHeader,
    Table
} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import {API} from "aws-amplify";
import "./ProjectSettings.css";

export default class ProjectSettings extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isDeleteLoading: false,
            isChangeLoading: false,
            confirmDelete: false,
            confirmManager: false,
            changeManager: false,
            project: this.props.project,
            projectStatus: this.props.project.projectStatus,
            projectManager: this.props.project.projectManager,
            developers: this.props.project.developers,
            title: this.props.project.title,
            description: this.props.project.description,
            projectRoles: [
                {
                    name: "Project Manager",
                    description: "In charge of the project, has complete access."
                },
                {
                    name: "Developer",
                    description: "Develops for the project, has access to viewing the " +
                        "project and adding new files/changing ones they've created."
                }
            ]
        };
        const roles = [];
        roles.push({Username: this.props.project.projectManager, Role: "Project Manager"});
        this.props.project.developers.map( (developer) => {
            roles.push({Username: developer, Role: "Developer"})
        });
        this.setState({roles: roles});
        this.setNewRoles = this.setNewRoles.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.changeDevelopers = this.changeDevelopers.bind(this);
    }

    changeDeleteBool = event => {
        this.setState({confirmDelete: !this.state.confirmDelete})
    };

    changeManagerBool = event => {
        this.setState({confirmManager: !this.state.confirmManager})
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value})
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        try {
            await this.props.checkTokens();
            await API.put("projects", `/projects/${this.props.project.projectId}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    title: this.props.title,
                    description: this.props.description
                },
                queryStringParameters: {
                    projectId: this.props.project.projectId
                }
            });
        } catch (error) {
            console.error(error.response);
            this.setState({isLoading: false});
        }
        this.setState({isLoading: false});
    };

    deleteProject = async event => {
        event.preventDefault();
        this.setState({isDeleteLoading: true});

        try {
            await this.props.checkTokens();
            await API.del("projects", `/projects/${this.props.match.params.id}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                }
            });
        } catch (error) {
            console.error(error.response);
        }
        this.setState({isDeleteLoading: false});
        this.props.hist.push('/');
    };

    changeDevelopers = async event => {
        event.preventDefault();
        this.setState({isChangeLoading: true});

        try {
            await this.props.checkTokens();
            await API.put("projects", `/projects/${this.props.match.params.id}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    projectManager: this.state.projectManager,
                    developers: this.state.developers
                }
            });
        } catch (error) {
            console.log(error.response);
            this.setState({isChangeLoading: false});
        }
    };

    changeManager = async event => {
        event.preventDefault();
        this.setState({isChangeLoading: true});

        try {
            await this.props.checkTokens();
            await API.put("projects", `/projects/${this.props.match.params.id}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    projectManager: this.state.projectManager,
                    developers: this.state.developers
                }
            });
        } catch (error) {
            console.log(error.response);
            this.setState({isChangeLoading: false});
        }
        this.props.history.push('/');
    };

    changeStatus = async (status, event) => {
        event.preventDefault();
        try {
            await this.props.checkTokens();
            await API.put("projects", `/projects/${this.props.match.params.id}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    projectStatus: this.state.projectStatus
                }
            });
        } catch (error) {
            console.log(error.response);
        }
    };

    setNewRoles(projectManager, developers) {
        if (projectManager === this.state.project.projectManager) {
            this.setState({
                changeManager: false,
                developers: developers
            });
        } else {
            this.setState({
                changeManager: true,
                projectManager: projectManager,
                developers: developers
            });
        }
    }

    render() {
        return(
            <div className="ProjectSettings">
                <PageHeader>Project Settings</PageHeader>
                <ListGroup>
                    <ListGroupItem>
                        <h2>Change project details</h2>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="title">
                                <ControlLabel>Title</ControlLabel>{": "}
                                <FormControl value={this.state.title}
                                             placeholder={this.props.project.title}
                                             onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup controlId="description">
                                <ControlLabel>Description</ControlLabel>{": "}
                                <FormControl value={this.state.description}
                                             placeholder={this.props.project.description}
                                             onChange={this.handleChange}
                                             componentClass="textarea" />
                            </FormGroup>
                            <LoadingButton type="submit"
                                           isLoading={this.state.isLoading}
                                           text="Change"
                                           loadingText="Changing..." />
                        </Form>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Table responsive striped bordered>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.projectRoles.map( (role, i) =>
                                    <tr>
                                        <td>{role.name}</td>
                                        <td>{role.description}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Table responsive striped bordered>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Skills</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <ProjectUsers project={this.state.project}
                                              siteUsers={this.props.siteUsers}
                                              setNewRoles={this.setNewRoles}
                                              changeDevelopers={this.changeDevelopers} />
                            </tbody>
                        </Table>
                    </ListGroupItem>

                    <ListGroupItem>

                    </ListGroupItem>
                </ListGroup>

                <StatusDropdown project={this.state.project} changeStatus={this.changeStatus}/>

                <Button bsStyle="danger"
                        onClick={this.changeDeleteBool}>
                    Delete Project?
                </Button>
                <Modal className="delete-prompt"
                       show={this.state.confirmDelete} >
                    <Modal.Header>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Deleting is permanent and you <strong>won't</strong> be able to get your project
                        back.
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.changeDeleteBool}>Cancel</Button>
                        <LoadingButton bsStyle="danger"
                                       onClick={this.deleteProject}
                                       isLoading={this.state.isDeleteLoading}
                                       text="Delete"
                                       loadingText="Deleting..." />
                    </Modal.Footer>
                </Modal>

                <Modal>
                    <Modal.Header>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Once you do this you will <strong>not</strong> be able to change it back (only the new project
                        manager or admin can.
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.changeManagerBool}>Cancel</Button>
                        <LoadingButton bsStyle="danger"
                                       onClick={this.changeManager}
                                       isLoading={this.state.isChangeLoading}
                                       text="Change"
                                       loadingText="Changing..." />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

class ProjectUsers extends Component {
    constructor(props){
        super(props);
    }

    handleClick = projectManager => {
        const developers = this.props.project.developers;
        developers.slice(developers.indexOf(this.props.project.projectManager), 1);
        developers.push(this.props.project.projectManager);
        this.props.setNewRoles(projectManager, developers);
    };

    handleRemove = async (developer, event) => {
        const developers = this.props.project.developers;
        developers.splice(developers.indexOf(developer), 1);
        await this.props.setNewRoles(this.props.project.projectManager, developers);
        await this.props.changeDevelopers(event);
    };

    render() {
        const siteUsers = this.props.siteUsers;
        const usernames = [];
        siteUsers.map( (user) => {
            usernames.push(user.Username);
        });

        return this.props.project.usernames.map( (username, i) => {
            const role = (username === this.props.project.projectManager) ? "Project Manager" : "Developer";
                let user = {};
                let email = "unknown";
                let skills = "unknown";
                if (usernames.indexOf(username) > -1) {
                    user = siteUsers[usernames.indexOf(username)];
                    user.Attributes.map( (attribute) => {
                        if (attribute.Name === "email") email = attribute.Value;
                        if (attribute.Name === "custom:skills") skills = attribute.Value;
                    });
                }
                return (
                    <tr>
                        <td>{(i+1).toString()}</td>
                        <td>{username}</td>
                        <td>
                            {role}
                            {role !== "Project Manager" ?
                                <Button onClick={() => this.handleClick(username)}
                                        style={{float: "right"}}>
                                    Make Project Manager
                                </Button>
                                : null
                            }
                        </td>
                        <td>{skills}</td>
                        <td>{email}</td>
                        <td>
                            <Button onClick={(event) => this.handleRemove(username, event)}>
                                <Glyphicon glyph="remove"/>
                            </Button>
                        </td>
                    </tr>
                );
            }
        );
    }
}

class StatusDropdown extends Component {
    constructor(props){
        super(props);
        this.state = {
            projectStatuses: ["pending", "active", "completed"],
            selected: this.props.project.projectStatus
        }
    }

    handleSelect = (eventKey, event) => {
        this.setState({selected: this.state.projectStatuses[eventKey]});
        this.props.changeStatus(this.state.selected, event);
    };

    render() {
        return (
            <DropdownButton dropup title={this.state.selected}>
                {this.state.projectStatuses.map( (status, i) => (
                    <MenuItem key={i} eventKey={i} onSelect={this.handleSelect}>
                        {status}
                    </MenuItem>
                ))}
            </DropdownButton>
        );
    }
}