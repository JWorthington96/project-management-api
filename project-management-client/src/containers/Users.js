import React, {Component} from "react";
import {ListGroup, ListGroupItem, PageHeader} from "react-bootstrap";
import {API} from "aws-amplify";

export default class Users extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            siteUsers: []
        }
    }

    async componentDidMount() {
        try {
            await this.props.checkTokens();
            const users = await API.get("projects", "/users/list", {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                }
            });
            this.setState({siteUsers: users.Users});
        } catch (error) {
            console.error(error.response)
        }
        this.setState({isLoading: false});
    }

    renderUserList(users) {
        return users.map( (user) =>
             <ListGroupItem key={user.Username} header={user.Username}>

                {user.Attributes.map( (attribute) => {
                    if (attribute.Name === "email") return <p>Email: {attribute.Value}</p>;
                    else if (attribute.Name === "custom:skills") return <p>Skills: {attribute.Value}</p>;
                })}

                <p>Created at: {new Date(user.UserCreateDate).toLocaleString()}</p>
            </ListGroupItem>
        );
    }

    render() {
        return(
            <div className="Users">
                <PageHeader>Current Users</PageHeader>
                <ListGroup className="users-list">
                    {!this.state.isLoading && this.state.siteUsers && this.renderUserList(this.state.siteUsers)}
                </ListGroup>
            </div>
        );
    }
}