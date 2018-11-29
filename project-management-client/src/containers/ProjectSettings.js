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
            projectStatus: this.props.project.projectStatus,
            title: this.props.project.title,
            description: this.props.project.description,
            projectManager: this.props.project.projectManager,
            developers: this.props.project.developers,
            usernames: this.props.project.usernames,
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
        this.setStatus = this.setStatus.bind(this);
        this.setNewRoles = this.setNewRoles.bind(this);
        this.setNewDevelopers = this.setNewDevelopers.bind(this);
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
            const attributes = await API.put("projects", `/projects/${this.props.project.projectId}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    title: this.state.title,
                    description: this.state.description,
                    projectStatus: this.state.projectStatus
                }
            });
            console.log(attributes);
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
                    developers: this.state.developers,
                    usernames: this.state.usernames
                }
            });
        } catch (error) {
            console.log(error.response);
            this.setState({isChangeLoading: false});
        }
    };

    setStatus(status) {
        this.setState({projectStatus: status});
    };

    setNewRoles(projectManager, developers) {
        this.setState({
            changeManager: true,
            projectManager: projectManager,
            developers: developers
        });
    }

    setNewDevelopers(developers, usernames) {
        this.setState({
            developers: developers,
            usernames: usernames
        });
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
                            <FormGroup>
                                <StatusDropdown projectStatus={this.state.projectStatus} setStatus={this.setStatus}/>
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
                        <Table responsive striped bordered ref="Users">
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
                                <ProjectUsers projectManager={this.state.projectManager}
                                              developers={this.state.developers}
                                              usernames={this.state.usernames}
                                              siteUsers={this.props.siteUsers}
                                              hist={this.props.hist}
                                              match={this.props.match}
                                              user={this.props.user}
                                              checkTokens={this.props.checkTokens}
                                              setNewDevelopers={this.setNewDevelopers}
                                              changeDevelopers={this.changeDevelopers} />
                            </tbody>
                        </Table>
                    </ListGroupItem>

                    <ListGroupItem>

                    </ListGroupItem>
                </ListGroup>

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
            </div>
        );
    }
}

class ProjectUsers extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            changeManager: false,
            newProjectManager: ""
        }
    }

    handleClick = (username, event) => {
        this.setState({
            changeManager: true,
            newProjectManager: username
        });
    };

    handleHide = event => {
        this.setState({
            changeManager: false,
            newProjectManager: ""
        });
    };

    handleRemove = async (developer, event) => {
        const developers = this.props.developers;
        const usernames = this.props.usernames;

        developers.splice(developers.indexOf(developer), 1);
        usernames.splice(usernames.indexOf(developer), 1);

        await this.props.setNewDevelopers(developers, usernames);
        await this.props.changeDevelopers(event);
    };

    handleChange = async event => {
        event.preventDefault();
        this.setState({isChangeLoading: true});

        const developers = this.props.developers;
        developers.splice(developers.indexOf(this.state.newProjectManager), 1, this.props.projectManager);
        console.log(developers);
        try {
            await this.props.checkTokens();
            await API.put("projects", `/projects/${this.props.match.params.id}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    projectManager: this.state.newProjectManager,
                    developers: developers
                }
            });
        } catch (error) {
            console.error(error);
            this.setState({isChangeLoading: false});
        }
        if (this.props.user.admin) {
            this.setState({changeManager: false});
            window.location.reload();
        } else {
            this.props.hist.push('/');
        }
    };

    renderModal() {
        return (
            <Modal className={"change-manager-prompt-" + this.state.newProjectManager}
                   show={this.state.changeManager} >
                <Modal.Header>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Once you do this you will <strong>not</strong> be able to change it back (only
                    <i>{" " + this.state.newProjectManager}</i> or an admin can).
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleHide}>Cancel</Button>
                    <LoadingButton bsStyle="danger"
                                   onClick={this.handleChange}
                                   isLoading={this.state.isLoading}
                                   text="Change"
                                   loadingText="Changing..." />
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const siteUsers = this.props.siteUsers;
        const siteUsernames = [];
        siteUsers.map( (user) => {
            siteUsernames.push(user.Username);
        });

        return this.props.usernames.map( (username, i) => {
            const role = (username === this.props.projectManager) ? "Project Manager" : "Developer";
                let user = {};
                let email = "unknown";
                let skills = "unknown";
                if (siteUsernames.indexOf(username) > -1) {
                    user = siteUsers[siteUsernames.indexOf(username)];
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
                                <Button onClick={(event) => this.handleClick(username, event)}
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
                        {this.renderModal()}
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
            selected: this.props.projectStatus
        }
    }

    handleSelect = (eventKey, event) => {
        this.setState({selected: this.state.projectStatuses[eventKey]});
        this.props.setStatus(this.state.projectStatuses[eventKey]);
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