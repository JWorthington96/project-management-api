import React, {Component} from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import "./Project.css";

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            project: null,
            title: this.props.title,
            description: this.props.description,
            roles: this.props.roles,
            users: this.props.users
        };
    }

    renderUsers() {
        return this.state.users.map( (user) =>
            <ListGroupItem key={user.id} header={user.username}>
                {
                    // TODO: add skills in here pls
                }
            </ListGroupItem>
        );
    }

    render() {
        return(
            <div>
                <h1>{this.state.title}</h1>
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
            </div>
        );
    }
}