import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Logger from 'js-logger';

import { vmClient, vmHub, vmNode } from '../validate';
import { postVm } from '../action';
import { resCode } from '../../../config/config';
import { modal } from '../../../style/app';

Logger.useDefaults();

const materialStyles = theme => ({
    closebutton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: 9,
        color: 'grey'
    },
    content: {
        padding: 5,
    },
    action: {
        margin: 0,
        padding: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    menu: {
        width: 200,
    }
});

class NodeForm extends Component {

    gmodel = { _id: "", type: "hub", ip: "", port: "", maxSession: "", maxInstance: "", username: "", createdBy: "" };

    constructor(props) {
        super(props);
        this.state = {
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
        } catch (e) {
            Logger.debug(e)
        }
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

    handleSubmit = () => {
        try {
            let { userId, workshop } = this.props.aStore;
            let { gmodel } = this.state;
            const { type, ip, port, maxSession, maxInstance, username } = gmodel;
            let _model = { _id: workshop._id, platform: workshop.platform, type, ip, port, username, maxSession, maxInstance, createdBy: userId, updatedBy: null };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = null;

            if (_model.type === "client") {
                status = vmClient(_model);
            } else if (_model.type === "hub") {
                status = vmHub(_model);
            } else if (_model.type === "node") {
                status = vmNode(_model);
            }

            if (status !== undefined && status.errorFound === false) {
                let response = await this.props.postVm(_model);
                let { status, result } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, "VM Created Successfully !");
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, result);
                }
                this.props.resetComponent("gKeyVMForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => {
        this.props.resetComponent("gKeyVMForm");
    }

    render() {
        let { classes } = this.props;
        let { gmodel, errors } = this.state;
        let { type, ip, port, maxSession, maxInstance, username } = gmodel;
        return (
            <Dialog maxWidth="xs" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>Create VM</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <TextField
                        fullWidth
                        name="type"
                        select
                        label="Name"
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
                        {[{ key: "1", label: "Client", value: "client" },
                        { key: "2", label: "Hub", value: "hub" },
                        { key: "3", label: "Node", value: "node" }].map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="IP"
                        name="ip"
                        type="input"
                        margin="normal"
                        value={ip}
                        onChange={this.handleChange}
                        className={classes.textField}
                        error={errors.ip}
                    />
                    {(type === "hub" || type === "node") ?
                        <TextField
                            label="Port"
                            name="port"
                            type="input"
                            margin="normal"
                            value={port}
                            onChange={this.handleChange}
                            className={classes.textField}
                            error={errors.port}
                        /> : null}
                    {(type === "node") ?
                        <TextField
                            label="Max Session"
                            name="maxSession"
                            type="input"
                            margin="normal"
                            value={maxSession}
                            onChange={this.handleChange}
                            className={classes.textField}
                            error={errors.maxSession}
                        /> : null}
                    {(type === "node") ? <TextField
                        label="Max Instance"
                        name="maxInstance"
                        type="input"
                        margin="normal"
                        value={maxInstance}
                        onChange={this.handleChange}
                        className={classes.textField}
                        error={errors.maxInstance}
                    /> : null}
                    <TextField
                        label="Username"
                        name="username"
                        type="input"
                        margin="normal"
                        value={username}
                        onChange={this.handleChange}
                        className={classes.textField}
                        error={errors.username}
                    />
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

export default withRouter(connect(mapStateToProps, { postVm })(withStyles(materialStyles)(NodeForm)));

