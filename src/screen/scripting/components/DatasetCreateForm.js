import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
    Typography, MenuItem, Grid
} from '@material-ui/core';
import { resCode } from '../../../config/config';
import { Close as CloseIcon } from '@material-ui/icons';

import { testcaseAddDataset, projectAddDataset, getDataset } from '../action';
import { datasetValidate } from '../validate';
import { getTime } from '../../../utils/helper';
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

class DatasetCreateForm extends Component {

    gmodel = { data: "", value: "", type: "string", auto: "", domain: "", pattern: "" };

    constructor(props) {
        super(props);
        this.state = {
            gmodel: this.gmodel,
            errors: {},
        };
    }

    UNSAFE_componentWillMount() {
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

    handleSubmit = async () => {
        try {
            let { gmodel, page, aStore } = this.props;
            let { userId } = aStore;
            let model = null;
            if (page === "testcase") {
                if (this.props.gStore.testcase._id === this.props.gmodel._id) {
                    const { data, value, type, auto, domain, pattern } = this.state.gmodel;
                    let { _id, project } = gmodel;
                    model = { data, value, type, auto, domain, pattern, createdBy: userId, testcase: _id, project };
                }
            } else {
                if (this.props.gStore.project._id === this.props.gmodel._id) {
                    const { data, value, type, auto, domain, pattern } = this.state.gmodel;
                    let { _id, client } = gmodel;
                    model = { data, value, type, auto, domain, pattern, createdBy: userId, project: _id, client };
                }
            }

            if (this.props.gStore.project._id === this.props.gmodel._id) {
                const { data, value, type, auto, domain, pattern } = this.state.gmodel;
                if (page === "testcase") {
                    let { _id, project } = gmodel;
                    model = { data, value, type, auto, domain, pattern, createdBy: userId, testcase: _id, project };
                } else {
                    let { _id, client } = gmodel;
                    model = { data, value, type, auto, domain, pattern, createdBy: userId, project: _id, client };
                }
            }
            this.handlePatch(model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handlePatch = async (model) => {
        try {
            let { page } = this.props;
            let status = datasetValidate(model);
            if (status !== undefined && status.errorFound === false) {
                let response = (page) === "testcase" ? await this.props.testcaseAddDataset(model) : await this.props.projectAddDataset(model);

                if (response.status === resCode.success) {
                    if (page === 'testcase') {
                        await this.props.getDataset(model);
                        let { gmodel } = this.props;
                        await gmodel.dataSet.push(model);
                    }
                    this.props.resetComponent("gKeyCreateDataset");
                    this.props.handleUpdateStatus(response.status, "Dataset Created !");
                } else if (response.status === resCode.error) {
                    this.props.resetComponent("gKeyCreateDataset");
                    this.props.handleUpdateStatus(response.status, "Dataset Already Exists !");
                }
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyCreateDataset");

    render() {
        let time = getTime();
        Logger.debug("TestcaseDatsetCreate>>>>>>", time);
        let { classes } = this.props;
        let { gmodel, errors } = this.state;
        let { data, value, type, auto, domain, pattern } = gmodel;
        return (
            <Dialog maxWidth="sm" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" onClose={this.handleClose} style={modal.header}>
                    <Typography style={modal.headerTitle}>Create Dataset</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                                fullWidth
                                id="fieldname"
                                label="Field Name"
                                name="data"
                                type="input"
                                margin="normal"
                                value={data}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.data}
                                autoFocus={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="value"
                                label="Value"
                                name="value"
                                type="input"
                                margin="normal"
                                value={value}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.value}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                                fullWidth
                                id="selecttype"
                                name="type"
                                select
                                label="Type"
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
                                {[{ key: "1", label: "String", value: "string" }
                                    , { key: "2", label: "Number", value: "number" }
                                    , { key: "3", label: "Boolean", value: "boolean" }].map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="auto"
                                fullWidth
                                label="Auto"
                                name="auto"
                                type="input"
                                margin="normal"
                                value={auto}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.auto}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                                id="domain"
                                fullWidth
                                label="Domain"
                                name="domain"
                                type="input"
                                margin="normal"
                                value={domain}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.domain}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="pattern"
                                fullWidth
                                label="Pattern"
                                name="pattern"
                                type="input"
                                margin="normal"
                                value={pattern}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.pattern}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.action} style={modal.action}>
                    <Button onClick={this.handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    return { aStore, gStore };
}

export default withRouter(connect(mapStateToProps, { testcaseAddDataset, projectAddDataset, getDataset })(withStyles(materialStyles)(DatasetCreateForm)));
