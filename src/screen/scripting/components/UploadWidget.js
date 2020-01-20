import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import CSVReader from "react-csv-reader";

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Button, Dialog, MobileStepper, IconButton, Typography, Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import { Close as CloseIcon, KeyboardArrowLeft, KeyboardArrowRight, Done } from '@material-ui/icons';
import { getCsvDetails, postCsvDetails } from '../action';
import { resCode } from '../../../config/config';

const materialStyles = theme => ({
    closebutton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1.5),
        color: theme.palette.grey[500],
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: "#bdbcbc",
    },
    right: theme.direction,
    left: theme.direction,
    stepper: {
        height: 400
    },
    table: {
        minWidth: 30
    }
});

class UploadWidget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gProject: this.props.gProject,
            activeStep: 0,
            gfile: "",
            filename: "",
            rowCount: "",
            csvTestcase: [],
            testcaseDuplicateCount: [],
            DuplicateTestcase: 0,
            NonDuplicateTestcase: [],
            uploadMessage: ""
        };
    }

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


    handleStepperClose = () => {
        this.props.handleStepperClose();
        this.setState({
            activeStep: 0, gfile: "", filename: "", rowCount: "", csvTestcase: [], testcaseDuplicateCount: [],
            DuplicateTestcase: 0, NonDuplicateTestcase: [], uploadMessage: ""
        });
    }

    handleNext = async () => {
        let { activeStep, csvTestcase, gProject, NonDuplicateTestcase } = this.state;
        try {
            if (activeStep === 1) {
                let model = { client: gProject.client, project: gProject._id, csvTestcase };
                let response = await this.props.getCsvDetails(model);
                if (response && response.status === resCode.success) {
                    let { NonDuplicateTestcase, testcaseDuplicateCount, DuplicateTestcase } = response.result;
                    this.setState({ NonDuplicateTestcase, testcaseDuplicateCount, DuplicateTestcase, activeStep: this.state.activeStep + 1 });
                } else {
                    this.setState({ rowCount: 0, uploadMessage: response.result, activeStep: 4 });
                }

            } else if (activeStep === 3) {
                let model = { client: gProject.client, project: gProject._id, NonDuplicateTestcase };
                let response = await this.props.postCsvDetails(model);
                if (response && response.status === resCode.success) {
                    await this.props.handleProjectClick();
                    this.setState({ uploadMessage: "Testcase Uploaded Successfully !", activeStep: this.state.activeStep + 1 });
                }
            } else {
                this.setState({ activeStep: this.state.activeStep + 1 });
            }
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleBack = async () => {
        try {
            this.setState({
                activeStep: 0, gfile: "", filename: "", rowCount: "", csvTestcase: [], testcaseDuplicateCount: [],
                DuplicateTestcase: 0, NonDuplicateTestcase: [], uploadMessage: ""
            });
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleData = async (data, filename, gfile) => {
        let exec = /(\.csv)$/i;
        if (!exec.exec(filename)) {
            this.setState({ activeStep: 4, rowCount: 0, filename: 'File Format Not Supported', uploadMessage: "File Format Not Supported !", csvTestcase: [] });
            return;
        } else if (data.length === 0) {
            this.setState({ activeStep: 4, rowCount: 0, filename: 'File Format Not Supported', uploadMessage: "Blank CSV File Unexceptable !", csvTestcase: [] });
            return;
        } else {
            this.setState({ rowCount: data.length, filename, gfile, csvTestcase: data });
        }

    }

    renderTableForTescase(Testcase) {
        let { classes } = this.props;
        return (
            <Paper style={{ height: '89%', overflow: 'auto', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Folder</TableCell>
                            <TableCell>SubFolder</TableCell>
                            <TableCell>Testcase</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Testcase.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell component="th" scope="row">
                                    {row.folder}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.subfolder}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.testcase}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    renderWidgetStep() {
        let { rowCount, filename, activeStep, testcaseDuplicateCount, DuplicateTestcase, NonDuplicateTestcase, uploadMessage } = this.state;
        if (activeStep === 0) {

            const papaparseOptions = {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
            };

            return (
                <Paper style={{ height: '75%', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                    <div className="container">
                        <CSVReader
                            cssClass="react-csv-input"
                            onFileLoaded={this.handleData}
                            parserOptions={papaparseOptions}
                        />
                    </div>
                </Paper>
            )
        } if (activeStep === 1) {
            return (
                <Paper style={{ height: '75%', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                    <p style={{ paddingTop: '21%', fontSize: 17, color: '#3b5575' }}>FileName: {filename}</p>
                    <p style={{ fontSize: 17, color: '#3b5575' }}>Count: {rowCount}</p>
                </Paper>
            )
        } if (activeStep === 2) {
            return (
                <Paper style={{ height: '75%', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                    <p style={{ paddingTop: '1%', marginBottom: 6, fontSize: 15, color: '#3b5575' }}>No Of Duplicate Testcases: {testcaseDuplicateCount}</p>
                    {this.renderTableForTescase(DuplicateTestcase)}
                </Paper>
            )
        } if (activeStep === 3) {
            return (
                <Paper style={{ height: '75%', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                    <p style={{ paddingTop: '1%', marginBottom: 6, fontSize: 15, color: '#3b5575' }}>{NonDuplicateTestcase.length + " "}Testcases To Be Uploaded</p>
                    {this.renderTableForTescase(NonDuplicateTestcase)}
                </Paper>
            )
        } if (activeStep === 4) {
            if (rowCount === 0) {
                return (
                    <Paper style={{ height: '75%', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                        <IconButton style={{ marginTop: '15%', padding: 0, color: 'red' }} edge="end" aria-label="add">
                            <CloseIcon fontSize="large" />
                        </IconButton>
                        <p style={{ paddingTop: '3%', fontSize: 15, color: '#3b5575' }}>{uploadMessage}</p>
                    </Paper>
                )
            } else {
                return (
                    <Paper style={{ height: '75%', textAlign: 'center', backgroundColor: "#dee2e6" }}>
                        <IconButton style={{ marginTop: '15%', padding: 0, color: 'green' }} edge="end" aria-label="add">
                            <Done fontSize="large" />
                        </IconButton>
                        <p style={{ paddingTop: '3%', fontSize: 15, color: '#3b5575' }}>{uploadMessage}</p>
                    </Paper>
                )
            }
        }
    }

    render() {
        let { classes, activeStep } = this.props
        return (

            <Dialog maxWidth="sm" fullWidth aria-labelledby="customized-dialog-title" open={true}>
                <div className={classes.stepper}>
                    <Paper square elevation={0} className={classes.header}>
                        <Typography>Upload Testcases</Typography>
                        <IconButton aria-label="close" className={classes.closebutton} onClick={() => this.handleStepperClose()}>
                            <CloseIcon />
                        </IconButton>
                    </Paper>
                    {this.renderWidgetStep()}
                    <MobileStepper
                        style={{ backgroundColor: "#bdbcbc", padding: 9 }}
                        steps={5}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        nextButton={
                            <Button size="small" onClick={this.handleNext} disabled={activeStep === 5 - 1}>
                                Next
          {classes.right === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                                {classes.left === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Cancel
        </Button>
                        }
                    />
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = ({ ScriptingReducer }) => {
    const gStore = ScriptingReducer;
    return { gStore };
}

export default withRouter(connect(mapStateToProps, { getCsvDetails, postCsvDetails })(withStyles(materialStyles)(UploadWidget)));
