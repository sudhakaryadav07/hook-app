import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import {undoTestcase } from '../action';
import { resCode } from '../../../config/config';
import { CommonForm } from './index';
import { getTime } from '../../../utils/helper';

Logger.useDefaults();

class ClientForm extends Component {

    gmodel = { number: "" };

    constructor(props) {
        super(props);
        this.state = {
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
        } catch (e) {
            Logger.debug(e)
        }
    }

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
            const { number } = gmodel;
            let _model = { number};
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let response = await this.props.undoTestcase(_model);
            let { status } = response;
            if (status === resCode.success) {
                this.props.handleUpdateStatus(status, "Testcases Removed Successfully !");
            } else if (status === resCode.error) {
                this.props.handleUpdateStatus(status, "Testcases Couldn't Be Removed !");
            }
            this.props.resetComponent("gKeyUndoForm");
    } catch(e) {
        Logger.debug(e);
    }
}

handleErrors = (errors) => this.setState({ errors });

handleClose = () => this.props.resetComponent("gKeyUndoForm");

render() {
    let time = getTime();
    Logger.debug("ClientForm>>>>>>", time);
    let { title, gmodel, errors } = this.state;
    let { number } = gmodel;
    return (
        <CommonForm
            title={title}
            label="Upload Number"
            name="number"
            value={number}
            errors={errors.number}
            handleChange={this.handleChange}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
        />
    );
}
}

export default connect(null, { undoTestcase })(ClientForm);
