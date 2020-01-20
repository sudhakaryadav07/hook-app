import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import { validateName } from '../validate';
import { clientPost, clientPatch } from '../action';
import { resCode } from '../../../config/config';
import { CommonForm } from './index';
import { getTime } from '../../../utils/helper';

Logger.useDefaults();

class ClientForm extends Component {

    gmodel = { name: "" };

    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            title: "",
            gmodel: this.gmodel,
            MODE: "",
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
            let { MODE } = this.props;
            let { userId } = this.props.aStore;
            let title, gmodel = "";
            if (MODE === "create") {
                title = "Create Client"
                gmodel = { ...this.gmodel, createdBy: userId,updatedBy:null };
            } else {
                title = "Edit Client"
                gmodel = { ...this.props.gStore.client, updatedBy: userId };
            }
            this.setState({ title, MODE, gmodel });
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
            const { name, code, status,createdBy,updatedBy } = gmodel;
            let validName = name.trim();
            let _model = { name: validName, code, status ,createdBy,updatedBy};
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = validateName(_model);
            if (status !== undefined && status.errorFound === false) {
                let { gmodel, MODE } = this.state;
                let { _id } = gmodel;

                let response, clientSuccess="";
                if (MODE === "create") {
                    response = await this.props.clientPost(_model);
                    clientSuccess = "Client Created Successfully !";
                } else {
                    response = await this.props.clientPatch(_id, _model);
                    clientSuccess = "Client Updated Successfully !";
                }

                let { status,result } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, clientSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, result);
                }
                this.props.resetComponent("gAKeyClientForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gAKeyClientForm");

    render() {
        let time = getTime();
        Logger.debug("ClientForm>>>>>>", time);
        let { title, gmodel, errors } = this.state;
        let { name } = gmodel;
        return (
            <CommonForm
                title={title}
                label="Name"
                name="name"
                value={name}
                errors={errors.name}
                handleChange={this.handleChange}
                handleClose={this.handleClose}
                handleSubmit={this.handleSubmit}
            />
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    return { aStore, gStore };
}

export default connect(mapStateToProps, { clientPost, clientPatch })(ClientForm);
