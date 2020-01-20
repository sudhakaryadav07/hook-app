import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Logger from 'js-logger';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardArrowLeft, KeyboardArrowRight, FindInPage } from '@material-ui/icons';
import { Button, CircularProgress, Paper, Grid, MobileStepper, Modal, Tooltip, TextField, MenuItem, IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { resCode } from '../../../config/config';
import { getStepsForTestsuit, getExecutionList, getImageForSteps, getTestlogs } from '../action';

const materialStyles = theme => ({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 40,
        paddingLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 407,
        maxWidth: 400,
        overflow: 'hidden',
        display: 'block',
        width: '100%',
        cursor: "pointer"
    },
    margin: {
        margin: theme.spacing(1),
    },
    progress: {
        margin: theme.spacing(2),
    },

    testerContainer: {
        width: "100%",
        margin: 0,
        height: '83vh',
        background: '#d9dfe2',
        borderRadius: 5
    },
    testerPaper2: {
        height: "92vh",
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: '#d9dfe2',
    },
    testerPaper3: {
        marginBottom: 5,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: '#d9dfe2',
    },
    testerPaper4: {
        height: "21vh",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        textAlign: 'center',
        backgroundColor: '#fffaf0',
        color: theme.palette.text.secondary,
    },
    testerPaper5: {
        height: "21vh",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'auto',
        textAlign: 'center',
        backgroundColor: '#fffaf0',
        color: theme.palette.text.secondary,
    },
    testerButton: {
        margin: theme.spacing(1),
        paddingLeft: "-20%",
        color: '#2c3e50'
    },
    testerPaper: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        cursor: "pointer",
        backgroundColor: '#e1e0ea'
    },
    testerTitle: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#2f4f4f'
    },

    customerContainer: {
        width: "100%",
        height: '83vh',
        margin: 0,
        background: '#fff1e0',
        borderRadius: 5
    },
    customerPaper2: {
        height: "92vh",
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: 'rgba(255,241,224,1)',
    },
    customerPaper3: {
        marginBottom: 5,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: 'rgba(255,241,224,1)',
    },
    customerPaper4: {
        height: "21vh",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        textAlign: 'center',
        backgroundColor: 'rgba(255,241,224,1)',
        color: theme.palette.text.secondary,
    },
    customerPaper5: {
        height: "21vh",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'auto',
        textAlign: 'center',
        backgroundColor: 'rgba(255,241,224,1)',
        color: theme.palette.text.secondary,
    },
    customerButton: {
        margin: theme.spacing(1),
        backgroundColor: '#ffc680'
    },
    customerPaper: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        backgroundColor: '#efd8ae'
    },
    customerTitle: {
        padding: theme.spacing(0),
        borderRadius: 0,
        textAlign: 'left',
        paddingLeft: 5,
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#8c5005'
    },

    right: theme.direction,
    left: theme.direction,
    paper: {
        position: 'absolute',
        height: '75vh',
        overflow: 'auto',
        width: '70%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        margin: "5% 10% 5% 15%",
    },
    textField: {
        paddingLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    name: {},
    value: {}
});

Logger.useDefaults();

class TestsuitDetailScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            classes: this.props.classes,
            client: this.props.gStore.client.name,
            project: this.props.gStore.project.name,

            role: this.props.aStore.role,
            activeStep: 0,
            open: null,
            gTestlogs: [],
            gStepLogs: [],

            gKeyZoom: null,
            imgPath: null,

            ExecutionIdList: [],
            disabledButton: true,
            selectedDate: moment(),
            executionId: "00000000-000000",

            stepImage: null,

            gRefreshKey: this.props.refreshComponent('gKeyTestlog'),

            selectedItem: ''
        };
    }

    UNSAFE_componentWillMount() {
        this.handleComponentWillMount();
    }

    UNSAFE_componentWillReceiveProps() {
        this.handlecomponentWillReceiveProps();
    }

    handlecomponentWillReceiveProps() {
        this.setState({ gRefreshKey: "gRefreshKey" + Math.random() })
    }

    handleComponentWillMount = async () => {
        try {
            let { selectedDate } = this.state;
            let { role } = this.props.aStore;
            let model = { selectedDate: selectedDate._d };
            let response = await this.props.getExecutionList(model);
            if (response && response.status === resCode.success) {
                let { result } = response;
                await this.refreshComponent('gRefreshKey');
                await this.setState({ role, ExecutionIdList: result, executionId: result[0].value });
            }
        } catch (e) {

        }
    }

    componentDidMount() {
        document.addEventListener('onmouseout', function (e) {
            e.target.style.border = "0.5px solid black"
        }, true)
    }

    refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
    resetComponent = async (key) => this.setState({ [key]: null });

    handleNext = async (data) => {
        try {
            let { activeStep, gStepLogs } = this.state;
            this.setState({ activeStep: this.state.activeStep + 1 });
            let model = gStepLogs[activeStep + 1];
            let response = await this.props.getImageForSteps(model);
            this.setState({ stepImage: response.result });
            await this.refreshComponent('gRefreshKey');
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleBack = async (data) => {
        try {
            let { activeStep, gStepLogs } = this.state;
            this.setState({ activeStep: this.state.activeStep - 1 });
            let model = gStepLogs[activeStep - 1];
            let response = await this.props.getImageForSteps(model);
            this.setState({ stepImage: response.result });
            await this.refreshComponent('gRefreshKey');
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleDateChange = async (date) => {
        try {
            let { testsuit } = this.props.gStore;
            let model = { testsuit: testsuit._id, selectedDate: date };
            let response = await this.props.getExecutionList(model);
            if (response && response.status === resCode.success) {
                let { result } = response;
                await this.refreshComponent('gRefreshKey');
                await this.setState({ ExecutionIdList: response.result, selectedDate: date, executionId: result.executionId });
            }
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleChange = (event) => {
        try {
            const _state = this.state;
            _state[event.target.name] = event.target.value;
            this.setState({ state: _state });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleOnRowClick = async (rowData) => {
        try {
            let { client } = this.props.gStore;
            let { project, testcase, executionId } = rowData;
            let model = { client: client._id, project, testcase, executionId };
            let response = await this.props.getStepsForTestsuit(model);

            if (response && response.status === resCode.success) {
                this.setState({ activeStep: 0, gStepLogs: response.result });
                let { result } = response;
                let imgResponse = await this.props.getImageForSteps(result[0]);
                this.setState({ stepImage: imgResponse.result });
            }

            this.setState({ selectedItem: rowData });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleZoom = (imgPath) => {
        try {
            this.setState({ imgPath, open: true });
            this.refreshComponent('gKeyZoom');
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleFilter = async () => {
        let { executionId } = this.state;
        let { project, desc } = this.props.gStore.testsuit;
        let model = { project, suite: desc, executionId };
        let response = await this.props.getTestlogs(model);
        if (response && response.status === resCode.success) {
            this.setState({ activeStep: 0, gStepLogs: [], gTestlogs: response.result });
        }
    }

    handleClose = () => this.setState({ open: false });

    renderZoom = () => {
        let { classes } = this.props;
        let { gKeyZoom, imgPath, open } = this.state;
        if (gKeyZoom) {
            return (
                <Modal open={open} onClose={this.handleClose}>
                    <img className={classes.paper} src={imgPath} alt="" />
                </Modal>
            );
        }
    }

    renderTestlogs() {
        let { role, gTestlogs, selectedItem } = this.state;
        let { classes } = this.props;
        let background = (role === "tester") ? '#d9dfe2' : 'rgba(255,241,224,1)';
        let paper = (role === "tester") ? classes.testerPaper : classes.customerPaper;
        let title = (role === "tester") ? classes.testerTitle : classes.customerTitle;
        let container = (role === "tester") ? classes.testerContainer : classes.customerContainer;

        if (gTestlogs && gTestlogs.length > 0) {
            return (
                <Grid spacing={1} className={container} >
                    <Grid container item xs={12} spacing={0}>
                        <React.Fragment>
                            <Grid item xs={1}>
                                <Paper className={title}>Sr No.</Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={title}>Description</Paper>
                            </Grid>
                            <Grid item xs={2}>
                                <Paper className={title}>Start Time</Paper>
                            </Grid>
                            <Grid item xs={2}>
                                <Paper className={title}>End Time</Paper>
                            </Grid>
                            <Grid item xs={2}>
                                <Paper className={title}>Elapsed Time</Paper>
                            </Grid>
                            <Grid item xs={1}>
                                <Paper className={title}>Status</Paper>
                            </Grid>
                        </React.Fragment>
                        {gTestlogs.map((data, i) => {

                            let background = (selectedItem) ? (data.no === selectedItem.no) ? '#7d7c79' : "" : "";
                            let trimmedTescase = (data.testcase) ? (data.testcase.length > 28) ? data.testcase.substring(0, 28) + "..." : data.testcase : " - ";

                            return (
                                <React.Fragment key={i} >
                                    <Grid item xs={1}>
                                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{i + 1}</Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{trimmedTescase}</Paper>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{data.startTime}</Paper>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{data.endTime}</Paper>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{data.elapsedTime}</Paper>
                                    </Grid>
                                    <Grid item xs={1} >
                                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{data.status}</Paper>
                                    </Grid>
                                </React.Fragment>
                            )
                        }
                        )}
                    </Grid>
                </Grid>
            );
        } else {
            return <h4 style={{ backgroundColor: background, height: "83vh", textAlign: 'center', paddingTop: '25%', borderRadius: 5 }}>No Testsuit Found !</h4>
        }
    }

    renderStepDetails() {
        let { classes } = this.props;
        let { role, gStepLogs, activeStep, stepImage } = this.state;
        const maxSteps = gStepLogs.length;

        let paper4, paper5 = null;

        paper4 = (role === "tester") ? classes.testerPaper4 : classes.customerPaper4;
        paper5 = (role === "tester") ? classes.testerPaper5 : classes.customerPaper5;

        try {
            if (gStepLogs && gStepLogs.length > 0) {
                let { startTime, endTime, action, data, locator, locatorType, stepSeq, stepName, status, failMessage } = gStepLogs[activeStep];


                let st = (startTime) ? startTime.split(':') : "";
                let et = (endTime) ? endTime.split(':') : "";

                let elapsedTime = moment.utc(moment(et[1], 'HH:mm:ss.SSS').diff(moment(st[1], 'HH:mm:ss.SSS'))).format('HH:mm:ss.SSS');

                let gridStatus = status === "pass" ? "#519a25" : "#f36767";
                let gridBorderColor = status === "pass" ? "0.5px solid green" : "0.5px solid red";

                let message = (failMessage) ? (failMessage.length > 50) ? failMessage.substring(0, 50) + "..." : failMessage : " - ";

                return (
                    <div className={classes.root}>
                        <Paper square elevation={0} className={paper4}>
                            <Grid className={paper5} container style={{ backgroundColor: gridStatus }} >

                                <Grid item xs={3} >
                                    <p style={{
                                        height: 26,
                                        borderBottom: gridBorderColor,
                                        textAlign: 'left',
                                        color: "#fff",
                                        fontWeight: 700,
                                        marginBottom: 0,
                                        paddingLeft: 5,
                                        fontSize: 17
                                    }}>
                                        {stepSeq}
                                    </p>
                                </Grid>

                                <Grid item xs={9} >
                                    <p style={{
                                        textAlign: 'left',
                                        borderBottom: gridBorderColor,
                                        height: 26,
                                        wordBreak: 'break-all',
                                        color: "#fff",
                                        marginBottom: 0
                                    }}>
                                        {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                                    </p>
                                </Grid>


                                <Grid item xs={3} >
                                    <p style={{
                                        wordBreak: 'break-all',
                                        borderBottom: gridBorderColor,
                                        textAlign: 'left',
                                        color: "#fff",
                                        paddingLeft: 5,
                                        marginBottom: 0
                                    }}>
                                        {action}
                                    </p>
                                </Grid>
                                <Grid item xs={9} >
                                    <p style={{
                                        wordBreak: 'break-all',
                                        borderBottom: gridBorderColor,
                                        textAlign: 'left',
                                        color: "#fff",
                                        marginBottom: 0
                                    }}>
                                        {(data) ? data : " -"}
                                    </p>
                                </Grid>

                                <Grid item xs={3} >
                                    <p style={{
                                        wordBreak: 'break-all',
                                        borderBottom: gridBorderColor,
                                        textAlign: 'left',
                                        color: "#fff",
                                        paddingLeft: 5,
                                        marginBottom: 0
                                    }}>
                                        {locatorType}
                                    </p>
                                </Grid>
                                <Grid item xs={9} >
                                    <p style={{
                                        wordBreak: 'break-all',
                                        borderBottom: gridBorderColor,
                                        textAlign: 'left',
                                        color: "#fff",
                                        paddingLeft: 5,
                                        marginBottom: 0
                                    }}>
                                        {(locator) ? locator : " -"}
                                    </p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p style={{
                                        wordBreak: 'break-all',
                                        borderBottom: gridBorderColor,
                                        textAlign: 'left',
                                        color: "#fff",
                                        marginBottom: 0,
                                        paddingLeft: 5
                                    }}> {st[1] + " (" + elapsedTime + ")"}</p>
                                </Grid>

                                <Grid item xs={12} >
                                    <Tooltip title={failMessage} interactive>
                                        <p style={{
                                            wordBreak: 'break-all',
                                            borderBottom: gridBorderColor,
                                            textAlign: 'left',
                                            marginBottom: 0,
                                            paddingLeft: 5
                                        }}> {message}
                                        </p>
                                    </Tooltip>
                                </Grid>

                            </Grid>
                        </Paper>

                        <Paper square elevation={0} style={{ borderRadius: 5 }}>
                            {(stepImage) ?
                                <img className={classes.img} alt="" src={stepImage} onClick={() => this.handleZoom(stepImage)} /> :
                                <img className={classes.img} alt="Nothing Found" src={require("../../../icon/img-not-found.jpg")} />
                            }
                            <MobileStepper
                                style={{ backgroundColor: '#2f4f4f', color: '#fff', padding: 3, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
                                steps={maxSteps}
                                position="static"
                                variant="text"
                                activeStep={activeStep}
                                nextButton={
                                    <Button size="small" onClick={() => this.handleNext(gStepLogs[activeStep])} disabled={activeStep === maxSteps - 1}>
                                        <p style={{ marginBottom: 0, color: "#fff" }}>Next</p>
                                        {classes.right === 'rtl' ? <KeyboardArrowLeft style={{ color: "#fff" }} /> : <KeyboardArrowRight style={{ color: "#fff" }} />}
                                    </Button>
                                }
                                backButton={
                                    <Button size="small" onClick={() => this.handleBack(gStepLogs[activeStep])} disabled={activeStep === 0}>
                                        {classes.left === 'rtl' ? <KeyboardArrowRight style={{ color: "#fff" }} /> : <KeyboardArrowLeft style={{ color: "#fff" }} />}
                                        <p style={{ marginBottom: 0, color: "#fff" }}>Back</p>
                                    </Button>
                                }
                            />
                        </Paper>
                    </div >
                );
            } else {
                return <h4 style={{ paddingTop: '40%' }}>No StepLog Found !</h4>
            }
        } catch (e) {
            console.log(e)
        }
    }

    renderFilterButton() {
        let { disabledButton, selectedDate, executionId } = this.state;
        if (selectedDate && executionId) {
            disabledButton = false;
        } else {
            disabledButton = true;
        }
        this.setState({ disabledButton });
    }

    renderTable() {
        let { classes } = this.props;
        let { role, ExecutionIdList, selectedDate, disabledButton, executionId, gRefreshKey } = this.state;
        let paper2, paper3, button = null;

        paper2 = (role === "tester") ? classes.testerPaper2 : classes.customerPaper2;
        paper3 = (role === "tester") ? classes.testerPaper3 : classes.customerPaper3;
        button = (role === "tester") ? classes.testerButton : classes.customerButton;

        if (gRefreshKey) {
            return (
                <Grid id="container" key={gRefreshKey} container spacing={3} style={{ width: "100%", margin: 0 }}>
                    <Grid item xs={8} style={{ paddingTop: 0, paddingLeft: 0, paddingBottom: 0, paddingRight: 6 }}>
                        <Paper className={paper3}>
                            <Grid container style={{ marginTop: 0 }}>
                                <Grid item xs={5} >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around" >
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="MM/dd/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Date picker inline"
                                                value={selectedDate}
                                                onChange={this.handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'selectdate',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                     id="selectexecutionid"
                                        name="executionId"
                                        select
                                        label="Execution Id"
                                        className={classes.textField}
                                        value={executionId}
                                        onChange={this.handleChange}
                                        SelectProps={{
                                            MenuProps: {
                                                className: classes.menu,
                                            },
                                        }}
                                        style={{ textAlign: 'left' }}
                                        margin="normal"

                                    >
                                        {ExecutionIdList.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton disabled={disabledButton} className={button} onClick={() => { this.handleFilter() }}>
                                        <FindInPage fontSize="large" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                        {this.renderTestlogs()}
                    </Grid>
                    <Grid item xs={4} style={{ padding: 0 }}>
                        <Paper className={paper2}>
                            {this.renderStepDetails()}
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
            <div>
                {this.renderTable()}
                {this.renderZoom()}
                {this.renderFilterButton()}
            </div>
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const gStore = ScriptingReducer;
    const aStore = SignInReducer;
    return { aStore, gStore };
}

export default withRouter(connect(mapStateToProps, { getStepsForTestsuit, getImageForSteps, getExecutionList, getTestlogs })(withStyles(materialStyles)(TestsuitDetailScreen)));


