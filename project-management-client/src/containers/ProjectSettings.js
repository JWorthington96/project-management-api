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
            title: this.props.title,
            description: this.props.description,
            roles: this.props.roles,
            users: this.props.users
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
            await API.put("projects", `projects/${this.props.projectId}`, {});
        } catch (error) {
            console.error(error);
            this.setState({isLoading: false});
        }
        this.setState({isLoading: false});
    };

    deleteProject = async event => {
        event.preventDefault();
        this.setState({isDeleteLoading: true});
        try {
            await API.del("projects", `/projects/${this.props.match.params.id}`, {});
        } catch (error) {
            console.error(error);
        }
        this.setState({isDeleteLoading: false});
        this.props.history.push('/');
    };

    renderRoles(){
        return this.state.roles.map( (role, i) =>
            <tr>
                <td>{i.toString()}</td>
                <td>{role.name}</td>
                <td>{role.description}</td>
            </tr>
        );
    }

    renderUsers(){
        return this.state.users.map( (user, i) =>
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
                        <h1>Change project details</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="title">
                                <ControlLabel>Title:</ControlLabel>{": "}
                                <FormControl value={this.state.title}
                                             placeholder={this.props.title}
                                             onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup controlId="description">
                                <ControlLabel>Title:</ControlLabel>{": "}
                                <FormControl value={this.state.description}
                                             placeholder={this.props.description}
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
                                       isLoading={this.state.isLoading}
                                       text="Delete"
                                       loadingText="Deleting..."/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}