import React, {Component} from "react";
import {ListGroup} from "react-bootstrap";
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
            const {name, description} = project;

            this.setState({
                isLoading: false,
                project,
                name,
                description
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

    /*
    renderUsers(users) {
        return users.map( (user) =>
            <ListGroupItem header={user.name}>
                {user.skills.toString()}
            </ListGroupItem>
        );
    }
    */

    renderProject(){
        return (
            <div>
                <h1>{this.state.name}</h1>
                <h2>{this.state.description}</h2>
                /*
                <ListGroup className="developers">
                    <p>{this.renderUsers(this.state.developers)}</p>
                </ListGroup>
                */
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