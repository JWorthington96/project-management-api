import React, {Component} from "react";
import {
    Button,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    ListGroup,
    ListGroupItem,
    Modal,
    PageHeader,
    Table
} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import {API} from "aws-amplify";

export default class ProjectSettings extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isDeleteLoading: false,
            confirmDelete: false,
            project: this.props.project,
            title: this.props.project.title,
            description: this.props.project.description
        }
    }

    changeDeleteBool = event => {
        this.setState({confirmDelete: !this.state.confirmDelete})
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value})
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});
        try {
            await API.put("projects", `/projects/${this.props.project.projectId}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                body: {
                    title: this.state.title,
                    description: this.state.description
                },
                queryStringParameters: {
                    IdentityId: this.props.user.identityId
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
            await API.del("projects", `/projects/${this.props.match.params.id}`, {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                queryStringParameters: {
                    IdentityId: this.props.user.identityId
                }
            });
        } catch (error) {
            console.error(error.response);
        }
        this.setState({isDeleteLoading: false});
        this.props.hist.push('/');
    };

    renderRoles(){
        return this.state.project.projectRoles.map( (role, i) =>
            <tr>
                <td>{i.toString()}</td>
                <td>{role.name}</td>
                <td>{role.description}</td>
            </tr>
        );
    }

    renderUsers(){
        return this.state.project.users.map( (user, i) =>
            <tr>
                <td>{i.toString()}</td>
                <td>{user.username}</td>
                <td>{user.skills}</td>
                <td>{user.role}</td>
            </tr>
        );
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
                                             onChange={this.handleChange} />
                            </FormGroup>
                            <LoadingButton type="submit"
                                           isLoading={this.state.isLoading}
                                           text="Change"
                                           loadingText="Changing..." />
                        </Form>
                    </ListGroupItem>

                    <ListGroupItem>
                            <Table responsive>
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Role</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderRoles}
                            </tbody>
                        </Table>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Username</th>
                                    <th>Skills</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderUsers}
                            </tbody>
                        </Table>
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
                                       loadingText="Deleting..."/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}