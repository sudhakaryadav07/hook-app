import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import { validateFolder } from '../validate';
import { postFolder, patchFolder } from '../action';
import { resCode } from '../../../config/config';
import { CommonForm } from './index';

Logger.useDefaults();

class FolderForm extends Component {

    gmodel = { client: null, project: null, folder: "", parentFolder: 0, createdBy: null, updatedBy: null };

    constructor(props) {
        super(props);
        this.state = {
            _id: "",
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
            let { MODE, TYPE, gStore, aStore } = this.props;
            let { client, project, folder } = gStore;
            let { userId } = aStore;
            let title, gmodel = "";
            if (MODE === "create") {
                title = "Create Folder"
                if (TYPE === "general") {
                    gmodel = { ...this.gmodel, client: client._id, project: project._id, createdBy: userId, updatedBy: null };
                } else {
                    gmodel = { ...this.gmodel, client: client._id, project: project._id, parentFolder: folder._id, createdBy: userId, updatedBy: null };
                }
            } else if (MODE === "child") {
                title = "Create Folder"
                gmodel = { ...this.gmodel, parentFolder: gStore.folder._id, client: client._id, project: project._id, createdBy: userId, updatedBy: null };
            } else {
                title = "Edit Folder"
                gmodel = { ...gStore.folder, updatedBy: userId };
            }
            this.setState({ title, MODE, gmodel });
        } catch (e) {
            console.log(e)
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
            const { client, project, folder, parentFolder, createdBy, updatedBy } = gmodel;
            let _model = { client, project, folder, parentFolder, createdBy, updatedBy };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = validateFolder(_model);
            if (status !== undefined && status.errorFound === false) {
                let { gmodel, MODE } = this.state;
                let { _id } = gmodel;

                let response, clientSuccess, clientError = "";
                if (MODE === "create" || MODE === "child") {
                    response = await this.props.postFolder(_model);
                    clientSuccess = "Folder Created !";
                    clientError = "Folder Already Created !";
                } else {
                    response = await this.props.patchFolder(_id, _model);
                    clientSuccess = "Folder Edited !";
                    clientError = "Folder Already Created !";
                }

                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, clientSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, clientError);
                }
                this.props.refreshComponent("gRefreshTree");
                this.props.resetComponent("gKeyFolderForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyFolderForm");

    render() {
        let { title, gmodel, errors } = this.state;
        let { folder } = gmodel;
        return (
            <CommonForm
                title={title}
                label="Name"
                name="folder"
                value={folder}
                errors={errors.folder}
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

export default connect(mapStateToProps, { postFolder, patchFolder })(FolderForm);
