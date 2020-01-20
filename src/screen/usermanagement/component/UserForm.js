import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Logger from 'js-logger';

import { registrationValidate } from '../validate';
import { postUser,patchUser } from '../action';
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

class UserForm extends Component {

    gmodel = { _id: "", client: "", clientName: "", name: "", username: "", password: "", role: "" };

    constructor(props) {
        super(props);
        this.state = {
            gmodel: this.gmodel,
            title: "",
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
            Logger.debug(e)
        }
    }

    initState = () => {
        try {
            let { MODE, aStore, gClient } = this.props;
            let { userId } = aStore;
            let { _id, name } = gClient;
            let title, gmodel = "";
            if (MODE === "create") {
                title = "Create User";
                gmodel = { ...this.gmodel, "client": _id, "clientName": name, createdBy: userId, updatedBy: null };
            } else {
                title = "Edit User";
                gmodel = { ...aStore.user, updatedBy: userId }
            }
            this.setState({ MODE, gmodel, title });
        } catch (e) {
            console.log(e)
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
            let { userId } = this.props.aStore;
            let { gmodel } = this.state;
            const { _id, client, clientName, username, name, password, role } = gmodel;
            let _model = { _id, client, clientName, username, name, password, role, createdBy: userId, updatedBy: null };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = registrationValidate(_model);
            if (status !== undefined && status.errorFound === false) {


                let { gmodel, MODE } = this.state;
                let { _id } = gmodel;

                let response, userSuccess, userError = "";
                if (MODE === "create") {
                    response = await this.props.postUser(_model);
                    userSuccess = "User Created !";
                    userError = "User Already Created !";
                } else {
                    response = await this.props.patchUser(_id, _model);
                    userSuccess = "User Edited !";
                    userError = "User Already Created !";
                }
                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, userSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, userError);
                }

                this.props.resetComponent("gKeyUserForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => {
        this.props.resetComponent("gKeyUserForm");
    }

    render() {
        let { classes } = this.props;
        let { MODE, gmodel, errors, title } = this.state;
        let { clientName, name, username, password, role } = gmodel;
        return (
            <Dialog maxWidth="xs"  onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>{title}</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <TextField
                        label="Client"
                        name="clientName"
                        type="input"
                        margin="normal"
                        value={clientName}
                        className={classes.textField}
                        error={errors.clientName}
                    />
                    <TextField
                        label="Name"
                        name="name"
                        type="input"
                        margin="normal"
                        value={name}
                        onChange={this.handleChange}
                        className={classes.textField}
                        error={errors.name}
                    />
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
                    {(MODE === "create") ? <TextField
                        label="Password"
                        name="password"
                        type="input"
                        margin="normal"
                        value={password}
                        onChange={this.handleChange}
                        className={classes.textField}
                        error={errors.password}
                    /> : null}
                    <TextField
                        name="role"
                        select
                        label="Role"
                        className={classes.textField}
                        value={role}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {[{ key: "1", label: "Admin", value: "admin" },
                        { key: "2", label: "Customer", value: "customer" },
                        { key: "3", label: "Tester", value: "tester" }].map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
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

export default withRouter(connect(mapStateToProps, { postUser,patchUser })(withStyles(materialStyles)(UserForm)));

