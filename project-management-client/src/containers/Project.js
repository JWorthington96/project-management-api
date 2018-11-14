import React, {Component} from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {API} from "aws-amplify";

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
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
                isLoading: false,
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
                </ListGroup>
            </div>
        );
    }

    render() {
        return(
            <div className="Project">
                {this.state.isLoading ? this.renderLoading() : this.renderProject()}
            </div>

        );
    }
}