import React, {Component} from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import "./Project.css";

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            project: this.props.project,
            usernames: []
        };
    }

    componentDidMount() {
        const siteUsernames = [];
        this.props.siteUsers.map( (user) => {
            siteUsernames.push(user.Username);
        });
        this.setState({usernames: siteUsernames});
        this.setState({isLoading: false});
    }

    renderUsers() {
        return this.state.project.developers.map( (username, i) =>
            <ListGroupItem key={i.toString()} header={username}>
                {!this.props.siteUsers[this.state.usernames.indexOf(username)] ?
                    <p>Skills{": unknown"}</p>
                    :
                    this.props.siteUsers[this.state.usernames.indexOf(username)].Attributes.map((attribute) => {
                        if (attribute.Name === "custom:skills") return <p>Skills{": " + attribute.Value}</p>;
                    })
                }
            </ListGroupItem>
        );
    }

    render() {
        return(
            <div>
                {this.state.isLoading ? <h1>Loading...</h1> :
                    <div>
                        <h1>{this.state.project.title}</h1>
                        <h2>{this.state.project.description}</h2>
                        <h3>Project manager: {this.state.project.projectManager}</h3>
                        <ListGroup className="developers">
                            <h4>Developers:</h4>
                            {this.renderUsers()}
                        </ListGroup>
                    </div>
                }
            </div>
        );
    }
}