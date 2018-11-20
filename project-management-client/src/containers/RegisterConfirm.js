import React, {Component} from "react";
import {ControlLabel, Form, FormGroup, FormControl} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import {API} from "aws-amplify";

export default class RegisterConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            code: ""
        }
        console.log(this.props.user);
    }

    verifyForm() {
        return this.state.code.length !== 6;
    }

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});
        window.setTimeout(null, 10000)

        try {
            window.setTimeout(null, 10000)
            await API.post("projects", "/register/confirm", {body: {
                    Username: this.props.user.username,
                    ConfirmationCode: this.state.code
                }
            });
            window.setTimeout(null, 10000)

            await API.post("projects", "/login", {body: {
                    Username: this.props.user.username,
                    Password: this.props.user.password
                }
            });
        } catch (error) {
            console.error(error);
            window.setTimeout(null, 10000)
            this.setState({isLoading: false});
        }
    }

    render() {
        return (
            <div className="RegisterConfirm">
                <h1>Thank you for registering!</h1>
                <h3>Please find the confirmation code in your email and enter it below</h3>
                <Form>
                    <FormGroup controlId="code">
                        <ControlLabel>Confirmation code</ControlLabel>
                        <FormControl value={this.state.code}
                                     onChange={this.handleChange}/>
                        <LoadingButton type="submit"
                                       disabled={this.verifyForm()}
                                       isLoading={this.state.isLoading}
                                       text="Confirm"
                                       loadingText="Confirming..." />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}