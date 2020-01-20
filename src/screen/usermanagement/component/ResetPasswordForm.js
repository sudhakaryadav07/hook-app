import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import { CommonForm } from '../../scripting/components/index';
import {validatePassword}from '../validate';

Logger.useDefaults();

class ResetPasswordForm extends Component {

    gmodel = { password: "" };

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            gmodel: this.gmodel,
            errors: {},
        };
    }

    refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
    resetComponent = async (key) => this.setState({ [key]: null });

    UNSAFE_componentWillMount() {
        this.handleComponentWillMount();
    }

    handleComponentWillMount = async () => {
        try {
            await this.initState();
        } catch (e) {
            Logger.debug(e)
        }
    }

    initState = () => {
        try {
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleChange = (event) => {
        try {
            const _state = this.state.gmodel;
            _state[event.target.name] = event.target.value;
            this.setState({ state: _state });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSubmit = () => {
        try {
            let { gmodel } = this.state;
            const { password } = gmodel;
            let model = { password };
            let status = validatePassword(model);
            if (status !== undefined && status.errorFound === false) {
                this.props.handlePatchPassword(password);
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyResetPassword");

    render() {
        let { gmodel ,errors} = this.state;
        let { password } = gmodel;
        return (
            <CommonForm
                title='Reset Password'
                label="New Password"
                name='password'
                value={password}
                errors={errors.password}
                handleChange={this.handleChange}
                handleClose={this.handleClose}
                handleSubmit={this.handleSubmit}
            />
        );
    }
}

const mapStateToProps = ({ SignInReducer }) => {
    const aStore = SignInReducer;
    return { aStore };
}

export default connect(mapStateToProps, {})(ResetPasswordForm);
