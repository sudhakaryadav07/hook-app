import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { Fab, CircularProgress, Paper, Grid, IconButton } from '@material-ui/core';
import { Add as AddIcon, CloudDownload as CloudDownloadIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { projectDatasetPatch, projectDatasetDestroy, getProjectDetails } from '../action';
import { ProjectDatasetReactGrid, DatasetCreateForm, ProjectDetailForm } from '../components/index';
import { resCode } from '../../../config/config';

const materialStyles = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    progress: {
        margin: theme.spacing(2),
    },
    testerFileTitle: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        backgroundColor: '#2f4f4f'
    },
    testerFilePaper: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        fontWeight: '600',
        color: '#000',
        backgroundColor: '#e1e0ea',
        cursor: "pointer"
    },
    testerPaper: {
        height: "45.5vh",
        backgroundColor: '#d9dfe2',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    testerPaper2: {
        marginTop: 5,
        height: "45.5vh",
        backgroundColor: '#d9dfe2',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    testerFab: {
        position: 'fixed',
        bottom: "49%",
        right: 8,
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: '#6495ed'
    },
    testerFab2: {
        position: 'fixed',
        bottom: 18,
        right: 8,
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: '#6495ed'
    },

    customerFileTitle: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        backgroundColor: '#d4b888',
        cursor: "pointer"
    },
    customerFilePaper: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#4f402f',
        cursor: "pointer"
    },
    customerPaper: {
        height: "45.5vh",
        backgroundColor: 'rgba(255,241,224,1)',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    customerPaper2: {
        marginTop: 5,
        height: "45.5vh",
        backgroundColor: 'rgba(255,241,224,1)',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    customerFab: {
        position: 'fixed',
        bottom: "49%",
        right: 8,
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: 'rgba(255,241,224,1)',
    },
    customerFab2: {
        position: 'fixed',
        bottom: 18,
        right: 8,
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: 'rgba(255,241,224,1)'
    },
});

Logger.useDefaults();

class ProjectViewScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            classes: this.props.classes,
            gKeyCreateDataset: null,
            gKeyProjectDetail: null,
            gRefreshKey: "gRefreshKey" + Math.random(),

            selectedItem: ''
        };
    }

    UNSAFE_componentWillMount() {
        try {
            this.getProjectDetails();
        } catch (e) {

        }
    }

    getProjectDetails = async () => {
        try {
            let { project } = this.props.gStore;
            await this.props.getProjectDetails(project);
        } catch (e) {

        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.handleComponentWillRecieveProps(props);
    }

    handleComponentWillRecieveProps = (props) => {
        // if (props.gStore.project.dataSet.length === this.props.gProject.dataSet.length) {
        //     return;
        // }
        // this.setState({ gRefreshKey: "gRefreshKey" + Math.random() })
        // try {
        //     this.getProjectDetails();
        // } catch (e) {

        // }
    }

    refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
    resetComponent = async (key) => this.setState({ [key]: null });

    handleDatasetEdit = async (data) => {
        try {
            if (data.project === this.props.gProject._id) {
                await this.props.projectDatasetPatch(data);
                // let { status } = response;
                // if (status === resCode.success) {
                //     this.props.handleUpdateStatus(status, "Dataset Updated !");
                // } else if (status === resCode.error) {
                //     this.props.handleUpdateStatus(status, "Dataset Not Updated !");
                // }
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleOnRowClick = (data) => {
        try {
            this.setState({ selectedItem: data });
        } catch (e) {

        }
    }

    handleDatasetDelete = async (_model) => {
        try {
            if (this.props.gStore.project._id === this.props.gProject._id) {
                let response = await this.props.projectDatasetDestroy(_model);
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

    renderCreateDatasetModal() {
        let { gKeyCreateDataset } = this.state;
        if (gKeyCreateDataset) {
            return (
                <DatasetCreateForm
                    key={gKeyCreateDataset}
                    page="project"
                    gmodel={this.props.gProject}
                    resetComponent={this.resetComponent}
                    handleUpdateStatus={this.props.handleUpdateStatus}
                    errors={this.state.errors} />
            );
        }
    }

    renderProjectDetails() {
        let { selectedItem } = this.setState;
        let { classes, gStore, role } = this.props;

        let { files } = gStore.project;

        let fab = (role === "tester") ? classes.testerFab2 : classes.customerFab2;
        let fileTitle = (role === "tester") ? classes.testerFileTitle : classes.customerFileTitle;
        let filePaper = (role === "tester") ? classes.testerFilePaper : classes.customerFilePaper;

        if (files && files.length > 0) {
            return (
                <div>
                    <Fab id="aboutproject" className={fab} onClick={() => this.refreshComponent("gKeyProjectDetail")}>
                        <AddIcon />
                    </Fab>
                    <Grid container item xs={12} spacing={0}>
                        <React.Fragment>
                            <Grid item xs={1}>
                                <Paper className={fileTitle}>Sr No.</Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={fileTitle}>Name</Paper>
                            </Grid>
                            <Grid item xs={2}>
                                <Paper className={fileTitle}>Location</Paper>
                            </Grid>
                            <Grid item xs={2}>
                                <Paper className={fileTitle}>Created Date</Paper>
                            </Grid>
                            <Grid item xs={1}>
                                <Paper className={fileTitle}>Action</Paper>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                    <Grid container item xs={12} spacing={0} style={{ height: '40.5vh', overflow: 'auto' }}>
                        {files.map((data, i) => {
                            let background = (selectedItem) ? (data === selectedItem) ? '#7d7c79' : "" : "";
                            let trimmedData = (data.length > 37) ? data.substring(0, 37) + "..." : data;

                            return (
                                <React.Fragment key={i} >
                                    <Grid item xs={1}>
                                        <Paper className={filePaper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{i + 1}</Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper className={filePaper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{trimmedData}</Paper>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Paper className={filePaper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{"test"}</Paper>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Paper className={filePaper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{"test"}</Paper>
                                    </Grid>
                                    <Grid item xs={1} >
                                        <Paper className={filePaper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>
                                            <IconButton onClick={() => this.handleFileDownload('gKeyUserForm', data)}>
                                                <CloudDownloadIcon style={{ cursor: 'pointer', float: 'right', marginRight: 10, fontSize: 20, color: 'red' }} />
                                            </IconButton>
                                            <IconButton onClick={() => this.handleDeleteUser(data)}>
                                                <DeleteIcon style={{ cursor: 'pointer', float: 'right', fontSize: 20, color: '#348216' }} />
                                            </IconButton>
                                        </Paper>
                                    </Grid>
                                </React.Fragment>
                            )
                        })
                        }
                    </Grid>
                </div >
            );
        } else {
            return  <Fab id="aboutproject" className={fab} onClick={() => this.refreshComponent("gKeyProjectDetail")}>
            <AddIcon />
        </Fab>
        }
    }

    renderDatasetTable() {
        let { classes } = this.state;
        let { gProject, role } = this.props;
        let fab = (role === "tester") ? classes.testerFab : classes.customerFab;

        let { dataSet } = gProject;
        if (dataSet && dataSet.length > 0) {
            return (
                <div>
                    <Fab id="addprojectleveldataset" className={fab} onClick={() => this.refreshComponent("gKeyCreateDataset")}>
                        <AddIcon />
                    </Fab>
                    <ProjectDatasetReactGrid
                        key={true}
                        mode="Write"
                        gProject={dataSet}
                        handleDatasetEdit={this.handleDatasetEdit}
                        handleDatasetDelete={this.handleDatasetDelete}
                    />
                </div>
            );
        } else {
            return <Fab id="addprojectleveldataset" className={fab} onClick={() => this.refreshComponent("gKeyCreateDataset")}>
                <AddIcon />
            </Fab>;
        }
    }

    renderProjectDetailForm() {
        let { gKeyProjectDetail } = this.state;
        if (gKeyProjectDetail) {
            return (
                <ProjectDetailForm
                    handleUpdateStatus={this.props.handleUpdateStatus}
                    resetComponent={this.resetComponent} />
            );
        }
    }


    renderTable() {
        let { classes, gRefreshKey } = this.state;
        let { role } = this.props;

        let paper = (role === "tester") ? classes.testerPaper : classes.customerPaper;
        let paper2 = (role === "tester") ? classes.testerPaper2 : classes.customerPaper2;

        if (gRefreshKey) {
            return (
                <Grid key={gRefreshKey} container spacing={3} style={{ width: "100%", margin: 0 }}>
                    <Grid item xs={6} style={{ padding: 1, paddingLeft: 0, paddingRight: 5, paddingBottom: 5 }}>
                        <Paper className={paper}>
                        {this.renderProjectDetailForm()}
                        </Paper>
                        <Paper className={paper2}>

                        </Paper>
                    </Grid>
                    <Grid item xs={6} style={{ paddingTop: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                        <Paper className={paper}>
                            {this.renderDatasetTable()}
                        </Paper>
                        <Paper className={paper2}>
                            {this.renderProjectDetails()}
                        </Paper>
                    </Grid>
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
        return (
            <div >
                {this.renderTable()}
                {this.renderCreateDatasetModal()}
            </div>
        );
    }
}

const mapStateToProps = ({ ScriptingReducer }) => {
    const gStore = ScriptingReducer;
    return { gStore };
}

export default withRouter(connect(mapStateToProps, { projectDatasetPatch, projectDatasetDestroy, getProjectDetails })(withStyles(materialStyles)(ProjectViewScreen)));


