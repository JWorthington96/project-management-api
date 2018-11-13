import React, {Component} from "react";
import {Button, ControlLabel, FormControl, FormGroup, Glyphicon, ListGroupItem} from "react-bootstrap";

// Component to allow the admin to add developers when creating the project
export default class DynamicDeveloperForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentId: 0,
            developers: []
        };
        this.addDeveloper = this.addDeveloper.bind(this);
        this.changeDeveloper = this.changeDeveloper.bind(this);
        this.deleteDeveloper = this.deleteDeveloper.bind(this);
    }

    addDeveloper(developer) {
        const id = this.state.currentId;
        const devs = this.state.developers;
        console.log(devs.valueOf());
        devs[id] = {id: id, username: developer};
        this.setState({currentId: id+1, developers: devs});
        /*
        this.setState(previousState => {
            return {
                developers: {...previousState.developers, this.state.i: developer},
                i: previousState.i + 1
            }
        });
        */
    }

    changeDeveloper(id, developer) {
        const devs = this.state.developers;
        devs[id] = {id: id, username: developer};
        this.setState({developers: devs});
    }

    deleteDeveloper(id) {
        const devs = this.state.developers;
        const newDevs = [];
        devs.splice(id, 1);
        console.log(devs.valueOf());
        for (let i = 0; i < devs.length; i++){
            devs[i] = {id: i, username: devs[i].username};
        }
        let maxi = devs.length - 1;
        this.setState({currentId: maxi, developers: devs});
    }

    render() {
        return(
            <div className="developers">
                <DeveloperFormList
                    developers={this.state.developers}
                    changeDeveloper={this.changeDeveloper}
                    deleteDeveloper={this.deleteDeveloper}
                />
                <NewDeveloperForm addDeveloper={this.addDeveloper} />
            </div>
        );
    }
}

// React component to render all the currently added developers
class DeveloperFormList extends Component {
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange = event => {
        const id = event.target.id;
        const value = event.target.value;
        this.props.changeDeveloper(id, value);
    };

    handleDelete = event => {
        const id = event.target.id;
        this.props.deleteDeveloper(id);
    }

    render() {
        return this.props.developers.map( developer =>
            <ListGroupItem>
                <FormGroup controlId={developer.id.toString()}>
                    {console.log(developer.id)}
                    {console.log(developer.username)}
                    <ControlLabel>Developer {developer.id + 1}</ControlLabel>
                    <FormControl onChange={this.handleChange} value={developer.username} />
                </FormGroup>

                <Button id={developer.id} onClick={this.handleDelete}>
                    <Glyphicon glyph="minus"/>
                </Button>
            </ListGroupItem>
        );
    }
}

// React component to render a new developer form
class NewDeveloperForm extends Component {
    //TODO: add a way to check the developer exists in the user base
    constructor(props){
        super(props);
        this.state = {
            newDeveloper: ""
        };
    }

    handleChange = event => {
        this.setState({newDeveloper: event.target.value});
    };

    handleAdd = event => {
        event.preventDefault();
        this.props.addDeveloper(this.state.newDeveloper);
        this.setState({newDeveloper: ""});
    };

    validateForm(){
        return this.state.newDeveloper.length > 0;
    }

    render() {
        return (
            <ListGroupItem>
                <FormGroup controlId="newDeveloper">
                    <ControlLabel>New developer</ControlLabel>
                    <FormControl onChange={this.handleChange} value={this.state.newDeveloper} />
                </FormGroup>

                <Button disabled={!this.validateForm()} onClick={this.handleAdd}>
                    <Glyphicon glyph="plus" />
                </Button>
            </ListGroupItem>
        );
    }
}