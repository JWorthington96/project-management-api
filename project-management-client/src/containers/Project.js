import React, {Component, Fragment} from "react";
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import {API} from "aws-amplify";
import LoadingButton from "../components/LoadingButton";
import "./Project.css";

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPageLoading: true,
            isLoading: false,
            confirmDelete: false,
            project: null,
            name: "",
            description: "",
            admin: "",
            projectManager: "",
            developers: []
        };
    }

    async componentDidMount() {
        try {
            const project = await this.getProject();
            const {name, description, admin, projectManager, developers} = project;

            this.setState({
                isPageLoading: false,
                project,
                name,
                description,
                admin,
                projectManager,
                developers
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    getProject() {
        return API.get("projects", `/projects/${this.props.match.params.id}`, {});
    }

    deleteProject = async event => {
        event.preventDefault();
        this.setState({isLoading: true});
        try {
            await API.del("projects", `/projects/${this.props.match.params.id}`, {});
        } catch (error) {
            console.error(error);
        }
        this.setState({isLoading: false});
        this.props.history.push('/');
    };

    changeDeleteBool = event => {
        this.setState({confirmDelete: !this.state.confirmDelete})
    }

    renderLoading() {
        return(<h1>Loading...</h1>);
    }

    renderUsers(users) {
        return users.map( (user) =>
            <ListGroupItem key={user.id} header={user.username}>
                {
                    // TODO: add skills in here pls
                }
            </ListGroupItem>
        );
    }

    renderProject(){
        return (
            <div>
                <h1>{this.state.name}</h1>
                <h2>{this.state.description}</h2>
                <h3>Project manager: {this.state.projectManager}</h3>
                <ListGroup className="developers">
                    <h4>Developers:</h4>
                    {this.renderUsers(this.state.developers)}
                    <ListGroupItem>
                        {
                            //TODO: add the project files here
                        }
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

    render() {
        return(
            <div className="Project">
                {this.state.isPageLoading ? this.renderLoading() : this.renderProject()}
            </div>

        );
    }
}