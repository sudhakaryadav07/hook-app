import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import { validateName } from '../validate';
import { projectPost, projectPatch } from '../action';
import { resCode } from '../../../config/config';
import { CommonForm } from './index';
import { getTime } from '../../../utils/helper';

Logger.useDefaults();

class ProjectForm extends Component {

    gmodel = { client: "", name: "" };

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
            Logger.debug(e);
        }
    }

    initState = () => {
        try {
            let { MODE } = this.props;
            let { userId } = this.props.aStore;
            let _id = this.props.gStore.client._id;
            let title, gmodel = "";
            if (MODE === "create") {
                title = "Create Project";
                gmodel = { ...this.gmodel, client: _id, createdBy: userId, updatedBy: null };
            } else {
                title = "Edit Project";
                gmodel = { ...this.props.gStore.project, updatedBy: userId };
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
            const { client, name, createdBy, updatedBy } = this.state.gmodel;
            let validName = name.trim();
            let _model = { client, name: validName, createdBy, updatedBy };
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

                let response, projectSuccess, projectError = "";
                if (MODE === "create") {
                    response = await this.props.projectPost(_model);
                    projectSuccess = "Project Created !";
                    projectError = "Project Already Created !";
                } else {
                    response = await this.props.projectPatch(_id, _model);
                    projectSuccess = "Project Edited !";
                    projectError = "Project Already Created !";
                }

                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, projectSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, projectError);
                }
                this.props.resetComponent("gKeyProjectForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyProjectForm");

    render() {
        let time = getTime();
        Logger.debug("ProjectForm>>>>>>", time);
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

export default connect(mapStateToProps, { projectPost, projectPatch })(ProjectForm);


