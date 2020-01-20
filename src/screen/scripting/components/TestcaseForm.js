import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import { validateDesc } from '../validate';
import { testcasePost, testcasePatch, testcaseUpdateRequest } from '../action';
import { resCode } from '../../../config/config';
import { CommonForm } from './index';
import { getTime } from '../../../utils/helper';

Logger.useDefaults();

class TestcaseForm extends Component {

    gmodel = { folder: "",folderName:"", project: "",client:"", desc: "", cloneof: 0 };

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
            let { MODE, aStore } = this.props;
            let { userId } = aStore;
            let { folder,project } = this.props.gStore;

            let testcase = this.props.gStore.testcase;
            let title, gmodel = "";
            if (MODE === "create") {
                title = "Create Testcase";
                gmodel = { ...this.gmodel,client:project.client, project: project._id, folder: folder._id, folderName: folder.folder, createdBy: userId, updatedBy: null };
            } else if (MODE === "clone") {
                title = "Clone Testcase";
                gmodel = { ...this.gmodel,client:project.client, project: project._id, cloneof: testcase._id, folder: folder._id, folderName: folder.folder, createdBy: userId, updatedBy: null };
            } else {
                title = "Edit Testcase";
                gmodel = { ...this.props.gStore.testcase, updatedBy: userId };
            }
            this.setState({ title, MODE, gmodel });
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleChange = (event) => {
        const _state = this.state.gmodel;
        _state[event.target.name] = event.target.value;
        this.setState({ state: _state });
    }


    handleSubmit = () => {
        try {
            const {folderName,client, folder, project, desc, cloneof, createdBy, updatedBy } = this.state.gmodel;
            let validDesc = desc.trim();
            let _model = {folderName, client,folder, project, desc: validDesc, cloneof, createdBy, updatedBy };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = validateDesc(_model);
            if (status !== undefined && status.errorFound === false) {
                let { gmodel, MODE } = this.state;
                let { _id } = gmodel;

                let response, testcaseSuccess, testcaseError = "";
                if (MODE === "create") {
                    response = await this.props.testcasePost(_model);
                    testcaseSuccess = "Testcase Created !";
                    testcaseError = "Testcase Already Created !";
                } else if (MODE === "clone") {
                    response = await this.props.testcasePost(_model);
                    testcaseSuccess = "Clone Created !";
                    testcaseError = "Clone Already Created !";
                } else if (MODE === "edit") {
                    response = await this.props.testcasePatch(_id, _model);
                    testcaseSuccess = "Testcase Edited !";
                    testcaseError = "Testcase Already Created !";
                }

                let { status } = response;
                if (status === resCode.success) {
                    this.props.testcaseUpdateRequest(_model);
                    this.props.resetComponent('gKeyStep');
                    this.props.refreshComponent('gKeyDefault');
                    this.props.handleUpdateStatus(status, testcaseSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, testcaseError);
                }
                this.props.resetComponent("gKeyTestcaseForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyTestcaseForm");

    render() {
        let time = getTime();
        Logger.debug("TestcaseForm>>>>>>", time);
        let { MODE, title, gmodel, errors } = this.state;
        let { cloneof, desc } = gmodel;
        return (
            <CommonForm
                title={title}
                label="Description"
                name="desc"
                value={desc}
                errors={errors.desc}
                cloneof={cloneof}
                MODE={MODE}
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

export default connect(mapStateToProps, { testcasePost, testcasePatch, testcaseUpdateRequest })(TestcaseForm);
