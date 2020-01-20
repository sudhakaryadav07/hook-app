import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
    Typography, MenuItem, Grid
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { resCode } from '../../../config/config';
import { LocatorListType, ActionListType, PredefinedSteps } from '../../../config/config';
import { stepValidate } from '../validate';
import { testcaseAddStep } from '../action';
import { getTime, seqMaker, getAutomaticStep } from '../../../utils/helper';
import { modal } from '../../../style/app';

const materialStyles = theme => ({
    closebutton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: 9,
        color: 'grey'
    },
    content: {
        padding: theme.spacing(2),
    },
    action: {
        margin: 0,
        padding: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    menu: {
        width: 200,
    }
});

Logger.useDefaults();

class StepCreateForm extends Component {

    gmodel = { condition: "none", action: "", data: null, field: "", locator: "", locatorData: "", type: "xpath", createdBy: null };

    constructor(props) {
        super(props);
        this.state = {
            gmodel: this.gmodel,
            dataSet: [],
            dataSetType: [],
            step: null,
            errors: {},
            isSave: false
        };
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

    handlePredefinedStep = async (event) => {
        let { gmodel } = this.state;
        let automaticStep = await getAutomaticStep(event, gmodel)
        let { model, step } = automaticStep
        this.setState({ step, gmodel: model });
    }


    componentDidMount() {
        this.handleComponentDidMount();
    }

    handleComponentDidMount = () => {
        try {
            this.initState();
        } catch (e) {
        }
    }

    initState = async () => {
        try {
            let { allDataset, booleanDataset } = this.props.gStore;
            allDataset = await allDataset.map((item, i) => { return { ...item, key: i, label: item.value } });
            booleanDataset = await booleanDataset.map((item, i) => { return { ...item, key: 1, label: item.value } });

            await this.setState({ dataSet: allDataset, dataSetType: booleanDataset });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSubmit = async () => {
        try {
            if (this.props.gStore.testcase._id === this.props.gmodel._id) {
                let { gmodel } = this.state;
                let { testcase } = this.props.gStore;
                let { userId } = this.props.aStore;
                let model = await seqMaker(testcase, gmodel, userId);
                let status = stepValidate(gmodel);
                if (status !== undefined && status.errorFound === false) {
                    this.handlePatch(model);
                } else {
                    this.handleErrors(status.errors);
                }
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handlePatch = async (model) => {
        try {
            let { testcase } = this.props.gStore;
            this.setState({ isSave: true });
            let response = await this.props.testcaseAddStep(model);
            if (response.status === resCode.success) {
                await testcase.step.push(model);
                this.props.handleUpdateStatus(response.status, "Step Created !");
                this.props.resetComponent("gKeyCreateStep");
            } else if (response.status === resCode.error) {
                this.setState({ gmodel: {} });
                this.props.handleUpdateStatus(response.status, "Step Already Exists !");
                this.props.resetComponent("gKeyCreateStep");
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyCreateStep");

    render() {
        let time = getTime();
        Logger.debug("TestcaseStepCreate>>>>>>", time);
        let { classes } = this.props;
        let { step, dataSet, dataSetType, gmodel, isSave, errors } = this.state;
        let { field, action, locator, locatorData, type, condition, data } = gmodel;
        return (
            <Dialog maxWidth="sm" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>Create Step</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                                id="predefinedsteps"
                                fullWidth
                                name="step"
                                select
                                label="Predefined Steps"
                                className={classes.textField}
                                value={step}
                                onChange={this.handlePredefinedStep}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"

                            >
                                {PredefinedSteps.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            id="fieldname"
                                fullWidth
                                label="Field Name"
                                name="field"
                                type="input"
                                margin="normal"
                                value={field}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.field}
                                autoFocus={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                             id="action"
                                fullWidth
                                name="action"
                                select
                                label="Action"
                                className={classes.textField}
                                value={action}
                                error={errors.action}
                                onChange={this.handleChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"

                            >
                                {ActionListType.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}  >
                            <TextField
                              id="loctype"
                                fullWidth
                                name="type"
                                select
                                label="Locator Type"
                                className={classes.textField}
                                value={type}
                                onChange={this.handleChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"

                            >
                                {LocatorListType.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                              id="locator"
                                fullWidth 
                                label="Locator"
                                name="locator"
                                type="input"
                                margin="normal"
                                value={locator}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.locator}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <TextField
                              id="selectlocatordata"
                                fullWidth
                                label="Locator Data"
                                select
                                name="locatorData"
                                margin="normal"
                                value={locatorData}
                                onChange={this.handleChange}
                                className={classes.textField}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }} >
                                {dataSet.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                              id="selectdataset"
                                fullWidth
                                label="Data"
                                select
                                name="data"
                                margin="normal"
                                value={data}
                                onChange={this.handleChange}
                                className={classes.textField}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }} >
                                {dataSet.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                              id="selectcondition"
                                fullWidth
                                name="condition"
                                select
                                label="Condition"
                                className={classes.textField}
                                value={condition}
                                onChange={this.handleChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"
                            >
                                {dataSetType.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.action} style={modal.action}>
                    <Button disabled={isSave} onClick={this.handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog >
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    return { aStore, gStore };
}

export default withRouter(connect(mapStateToProps, { testcaseAddStep })(withStyles(materialStyles)(StepCreateForm)));
