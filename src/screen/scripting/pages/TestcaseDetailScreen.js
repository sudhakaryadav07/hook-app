import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { SwapHoriz } from '@material-ui/icons';
import { Fab, CircularProgress, Paper, Grid, Typography } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { StepMaker } from '../../../utils/helper';

import {
    testcaseStepPatch, testcaseDatasetPatch, testcaseStepDestroy,
    testcaseAddBulkStep, testcaseDatasetDestroy, testcaseSequencePatch,
    testcaseAddDataset, testcaseSwipeRequest, getDataset,setTestcase
} from '../action';
import { StepReactGrid, DatasetReactGrid, StepCreateForm, DatasetCreateForm, ProjectDatasetReactGrid } from '../components/index';
import { resCode } from '../../../config/config';
import { getTime } from '../../../utils/helper';

const materialStyles = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    progress: {
        margin: theme.spacing(2),
    },
    paper2: {
        height: "92vh",
        backgroundColor: '#d9dfe2',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    paper3: {
        height: "45.5vh",
        backgroundColor: '#d9dfe2',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    paper4: {
        marginTop: 6,
        height: "45.5vh",
        backgroundColor: '#d9dfe2',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    stepFab: {
        position: 'fixed',
        bottom: 18,
        right: "35%",
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: '#6495ed'
    },
    stepFab2: {
        position: 'fixed',
        bottom: 18,
        right: "1%",
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: '#6495ed'
    },
    datasetFab: {
        position: 'fixed',
        bottom: "49%",
        right: 8,
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: '#6495ed'
    },
    expandMore: {
        margin: 8,
        position: 'fixed',
        bottom: '3.5%',
        right: '50%',
        color: '#0a0d8a',
        cursor: 'pointer'
    }, smessage: {
        textAlign: 'right',
        flexGrow: 1,
        fontFamily: "monospace",
        fontSize: 16,
        color: 'green',
        position: 'fixed',
        left: '2%',
        bottom: 8,
        fontWeight: 'bolder'
    },
    emessage: {
        textAlign: 'right',
        flexGrow: 1,
        fontFamily: "monospace",
        fontSize: 16,
        color: 'red',
        position: 'fixed',
        left: '2%',
        bottom: 8,
        fontWeight: 'bolder'
    },
});

Logger.useDefaults();

class TestcaseIndexScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            classes: this.props.classes,

            client: this.props.gStore.client.name,
            project: this.props.gStore.project.name,

            gKeyCreateStep: null,
            gKeyCreateDataset: null,

            showButton: "Expand",
            toggleStatus: "shrinked",

            datasetWidth: "",
            stepWidth: "",

            upDateStatus: "",
            upDateStatusMessage: "",

            gRefreshKey: this.props.refreshComponent('gKeyStep')
        };
    }

    UNSAFE_componentWillReceiveProps(props) {

        this.handleComponentWillRecieveProps(props);
    }

    handleComponentWillRecieveProps = (props) => {
        try {
            let { gStore, gTestcase } = this.props;
            let { testcase } = gStore;

            if (testcase.dataSet.length === gTestcase.dataSet.length) {
                return;
            }

            this.setState({ gRefreshKey: "gRefreshKey" + Math.random() })
        } catch (e) {

        }
    }

    refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
    resetComponent = async (key) => this.setState({ [key]: null });

    componentDidMount() {
        document.addEventListener('click', this.saveData, true);
        document.addEventListener('keydown', this.toggleScreen, true);
    }

    saveData = async (e) => {
        try {
            if (e.shiftKey && e.ctrlKey) {
                if (window.location.host.includes('robotan.in') || window.location.host.includes('localhost') || window.location.host.includes('192.168.0.191')) {
                    let data = await navigator.clipboard.readText();
                    if (data) {
                        let stepArray = await StepMaker(data);
                        if (stepArray && stepArray.length >= 1) {

                            let { _id } = this.props.gStore.selectedTestcase;
                            console.log(">>>>>>>>>>>>>>>>>>>>", _id)
                            let model = { _id, stepArray };
                            let response = await this.props.testcaseAddBulkStep(model);
                            let { status } = response;
                            if (status === resCode.success) {
                                this.props.handleUpdateStatus(status, "Step Added !");
                            } else if (status === resCode.error) {
                                this.props.handleUpdateStatus(status, "Step Not Added !");
                            }
                            await this.props.setTestcase(null);
                            navigator.clipboard.writeText('');
                            localStorage.setItem({ "tempString": null });
                        }
                        this.setState({ gRefreshKey: "gRefreshKey" + Math.random() });
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    toggleScreen = async (e) => {
        if (e.ctrlKey && e.keyCode === 32) {
            let { showButton } = this.state;
            if (showButton === "Expand") {
                await this.expandDataset();
            } else if (showButton === "Shrink") {
                await this.shrinkDataset();
            }
        } return;
    }

    handleUpdateStatus = (status, message) => this.props.handleUpdateStatus(status, message);

    handleStepEdit = async (data) => {
        try {
            if (this.props.gStore.testcase._id === this.props.gTestcase._id) {
                let response = await this.props.testcaseStepPatch(data);
                let { status } = response;
                if (status === resCode.success) {
                    this.setState({ upDateStatus: status, upDateStatusMessage: "Step Updated !" });
                    this.props.handleUpdateStatus(status, "Step Updated !");
                } else if (status === resCode.error) {
                    this.setState({ upDateStatus: status, upDateStatusMessage: "Step Not Updated !" });
                    this.props.handleUpdateStatus(status, "Step Not Updated !");
                }

                setTimeout(() => {
                    this.setState({ upDateStatus: false, upDateStatusMessage: "" });
                }, 5000)
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleDatasetEdit = async (data) => {
        try {
            if (this.props.gStore.testcase._id === this.props.gTestcase._id) {
                let response = await this.props.testcaseDatasetPatch(data);

                let { status } = response;
                if (status === resCode.success) {
                    this.setState({ upDateStatus: status, upDateStatusMessage: "Dataset Updated !" });
                } else if (status === resCode.error) {
                    this.setState({ upDateStatus: status, upDateStatusMessage: "Dataset Not Updated !" });
                }

                setTimeout(() => {
                    this.setState({ upDateStatus: false, upDateStatusMessage: "" });
                }, 5000)
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    sequencePatch = async (_id, data) => {
        try {
            if (this.props.gStore.testcase._id === this.props.gTestcase._id) {
                let response = await this.props.testcaseSequencePatch(_id, data);

                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, "Sequence Updated !");
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, "Sequence Not Updated !");
                }
            }
        } catch (e) {
            Logger.debug(e);
        }

    }

    handleStepDelete = async (_model) => {
        try {
            if (this.props.gStore.testcase._id === this.props.gTestcase._id) {
                let response = await this.props.testcaseStepDestroy(_model);
                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, "Step Deleted !");
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, "Step Not Deleted !");
                }
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleDatasetDelete = async (_model) => {
        try {
            if (this.props.gStore.testcase._id === this.props.gTestcase._id) {
                let response = await this.props.testcaseDatasetDestroy(_model);
                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, "Dataset Deleted !");
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, "Dataset Not Deleted !");
                }
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleCustomDataset = async (_model) => {
        try {
            let { project, testcase, field, seq } = _model;
            let model = { seq, project, testcase, data: field, value: false, auto: false, type: "boolean" };
            if (this.props.gStore.testcase._id === this.props.gTestcase._id) {
                let dmodel = { project, testcase };
                let response = await this.props.testcaseAddDataset(model);
                await this.props.getDataset(dmodel);
                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, "Dataset Added !");
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, "Dataset Not Added !");
                }
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    renderCreateStepModal() {
        let { gKeyCreateStep } = this.state;
        if (gKeyCreateStep) {
            return (
                <StepCreateForm
                    key={gKeyCreateStep}
                    gmodel={this.props.gTestcase}
                    resetComponent={this.resetComponent}
                    handleUpdateStatus={this.handleUpdateStatus}
                    errors={this.state.errors} />
            );
        }
    }

    renderCreateDatasetModal() {
        let { gKeyCreateDataset } = this.state;
        if (gKeyCreateDataset) {
            return (
                <DatasetCreateForm
                    key={gKeyCreateDataset}
                    page="testcase"
                    gmodel={this.props.gTestcase}
                    resetComponent={this.resetComponent}
                    handleUpdateStatus={this.handleUpdateStatus}
                    errors={this.state.errors} />
            );
        }
    }


    renderStepsTable() {
        let { classes, gTestcase, gProject, gStore } = this.props;
        let { _id, step, cloneof } = gTestcase;
        let stepTable = { project: gProject._id, _id, step };

        let { swapTestcasePage } = gStore;

        if (!cloneof) {
            if (step && step.length > 0) {
                return (
                    <div >
                        {(swapTestcasePage === false) ?
                            <Fab id="addstep" className={classes.stepFab2} onClick={() => this.refreshComponent('gKeyCreateStep')}>
                                <AddIcon />
                            </Fab> :
                            <Fab id="addstep" className={classes.stepFab} onClick={() => this.refreshComponent('gKeyCreateStep')}>
                                <AddIcon />
                            </Fab>
                        }
                        <StepReactGrid
                            mode="Write"
                            stepTable={stepTable}
                            sequencePatch={this.sequencePatch}
                            handleStepEdit={this.handleStepEdit}
                            handleStepDelete={this.handleStepDelete}
                            handleCustomDataset={this.handleCustomDataset}
                        />
                    </div>
                );
            } else {
                if (swapTestcasePage === false) {
                    return (
                        <Fab id="addstep" className={classes.stepFab2} onClick={() => this.refreshComponent('gKeyCreateStep')}>
                            <AddIcon />
                        </Fab>
                    );
                } else {
                    return (
                        <Fab id="addstep" className={classes.stepFab} onClick={() => this.refreshComponent('gKeyCreateStep')}>
                            <AddIcon />
                        </Fab>
                    )
                }

            }
        } else {
            return <StepReactGrid mode="Read" stepTable={stepTable} />

        }
    }

    expandDataset = async () => {
        let model = { swipe: true }
        await this.props.testcaseSwipeRequest(model);
        this.setState({ gRefreshKey: "gRefreshKey" + Math.random(), showButton: "Shrink" });
    }

    shrinkDataset = async () => {
        let model = { swipe: false }
        await this.props.testcaseSwipeRequest(model);
        this.setState({ gRefreshKey: "gRefreshKey" + Math.random(), showButton: "Expand" });
    }

    renderDatasetTable() {
        let { toggleStatus } = this.state;
        let { classes, gTestcase, gProject, gStore } = this.props;
        let { _id, dataSet, cloneof } = gTestcase;

        let { swapTestcasePage } = gStore;

        let dataSetTable = { project: gProject._id, _id, dataSet };

        if (!cloneof) {
            if (dataSet && dataSet.length > 0) {
                return (
                    <div >
                        {(swapTestcasePage === true) ? <Fab id="addtescaseleveldataset" className={classes.datasetFab} onClick={() => this.refreshComponent("gKeyCreateDataset")}>
                            <AddIcon />
                        </Fab> : null}
                        <DatasetReactGrid
                            mode="Write"
                            toggleStatus={toggleStatus}
                            testcase={dataSetTable}
                            handleDatasetEdit={this.handleDatasetEdit}
                            handleDatasetDelete={this.handleDatasetDelete}
                        />
                    </div>
                );
            } else {
                if (swapTestcasePage === true) {
                    return (
                        <Fab id="addtescaseleveldataset" className={classes.datasetFab} onClick={() => this.refreshComponent("gKeyCreateDataset")}>
                            <AddIcon />
                        </Fab>)
                } else {
                    return null;
                }

            }
        } else {
            if (dataSet && dataSet.length > 0) {
                return (
                    <DatasetReactGrid
                        mode="Read"
                        testcase={dataSetTable}
                        handleDatasetEdit={this.handleDatasetEdit}
                    />
                );
            }
        }

    }

    renderProjectDatasetTable() {
        let { gProject } = this.props;
        return (
            <ProjectDatasetReactGrid
                mode="Read"
                gProject={gProject.dataSet} />
        );
    }

    renderTable() {
        let { classes, gRefreshKey, datasetWidth, stepWidth, showButton, upDateStatus, upDateStatusMessage } = this.state;

        let { swapTestcasePage } = this.props.gStore;
        stepWidth = (swapTestcasePage === true) ? 8 : 12;
        datasetWidth = (swapTestcasePage === true) ? 4 : 0;


        if (gRefreshKey) {
            return (
                <Grid id="container" key={gRefreshKey} container spacing={3} style={{ width: "100%", margin: 0 }}>
                    {(upDateStatus === resCode.success) ?
                        <Typography className={classes.smessage}> {upDateStatusMessage} </Typography> :
                        <Typography className={classes.emessage}>  {upDateStatusMessage} </Typography>}
                    <Grid item xs={stepWidth} style={{ padding: 1, paddingLeft: 0, paddingRight: 5, paddingBottom: 5 }}>
                        <Paper className={classes.paper2}>
                            {this.renderStepsTable()}
                        </Paper>
                    </Grid>
                    {showButton === "Expand" ?
                        <SwapHoriz fontSize="large" id="toggletostep" className={classes.expandMore} onClick={() => this.expandDataset()} /> :
                        <SwapHoriz fontSize="large" id="toggletostep" className={classes.expandMore} onClick={() => this.shrinkDataset()} />
                    }
                    {(swapTestcasePage === true) ?
                        <Grid item xs={datasetWidth} style={{ paddingTop: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                            <Paper className={classes.paper3}>
                                {this.renderDatasetTable()}
                            </Paper>
                            <Paper className={classes.paper4}>
                                {this.renderProjectDatasetTable()}
                            </Paper>
                        </Grid> : null}
                </Grid>
            );

        } else {
            return (
                <div style={{ textAlign: "center" }}>
                    <CircularProgress className={classes.progress} />
                </div>
            );
        }
    }

    render() {
        let time = getTime();
        Logger.debug("StepIndexScreen>>>>>>", time);
        return (
            <div>
                {this.renderTable()}
                {this.renderCreateStepModal()}
                {this.renderCreateDatasetModal()}
            </div>
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    return { aStore, gStore };
}

export default withRouter(connect(mapStateToProps, {
    testcaseStepPatch, testcaseDatasetPatch, testcaseStepDestroy,
    testcaseAddBulkStep, testcaseDatasetDestroy, testcaseSequencePatch,
    testcaseAddDataset, testcaseSwipeRequest, getDataset,setTestcase
})(withStyles(materialStyles)(TestcaseIndexScreen)));


