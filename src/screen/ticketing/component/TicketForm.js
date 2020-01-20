import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Logger from 'js-logger';

import { ticketValidate } from '../validate';
import { ticketPost, ticketPatch } from '../action';
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

    gmodel = { description: "", action: "", category: "", status: "", comment: "", createdBy: "", updatedBy: "" };

    constructor(props) {
        super(props);
        this.state = {
            MODE: null,
            title: null,
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
            this.initState();
        } catch (e) {
            Logger.debug(e)
        }
    }

    initState = async () => {
        try {
            let { MODE, tStore, aStore } = this.props;
            let { userId } = aStore;
            let title, gmodel = "";
            if (MODE === "create") {
                title = "Create Ticket";
                gmodel = { ...this.gmodel, comment: "Ticket Opened", createdBy: userId, updatedBy: null };
            } else {
                title = "Edit Ticket";
                gmodel = { ...tStore.ticket, updatedBy: userId }
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
            let { gStore, aStore } = this.props;
            let { client, project } = gStore;
            let { username } = aStore;
            let { gmodel } = this.state;
            const { description, action, category, status, comment, createdBy, updatedBy } = gmodel;
            let _model = { client: client._id, project: project._id, description, action, category, status, comment, username, createdBy, updatedBy };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = ticketValidate(_model);
            if (status !== undefined && status.errorFound === false) {
                let { gmodel, MODE } = this.state;
                let { _id } = gmodel;

                let response, ticketSuccess, ticketError = "";
                if (MODE === "create") {
                    response = await this.props.ticketPost(_model);
                    ticketSuccess = "Ticket Created !";
                    ticketError = "Ticket Already Created !";
                } else {
                    response = await this.props.ticketPatch(_id, _model);
                    ticketSuccess = "Ticket Edited !";
                    ticketError = "Ticket Already Created !";
                }

                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, ticketSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, ticketError);
                }

                this.props.resetComponent("gKeyTicketForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => {
        this.props.resetComponent("gKeyTicketForm");
    }

    render() {
        let { classes } = this.props;
        let { title, gmodel, errors } = this.state;
        let { description, action, category, status, comment } = gmodel;
        return (
            <Dialog maxWidth="xs" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>{title}</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <TextField
                        id="ticketdescription"
                        label="Description"
                        name="description"
                        type="input"
                        margin="normal"
                        multiline={true}
                        value={description}
                        onChange={this.handleChange}
                        className={classes.textField}
                        error={errors.description}
                    />
                    <TextField
                        id="selectticketaction"
                        name="action"
                        select
                        label="Action"
                        className={classes.textField}
                        error={errors.action}
                        value={action}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {[
                            { key: "1", label: "Add", value: "add" },
                            { key: "2", label: "Remove", value: "remove" },
                            { key: "3", label: "Modify", value: "modify" },
                            { key: "4", label: "Other", value: "other" }
                        ].map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="selectticketcategory"
                        name="category"
                        select
                        label="Category"
                        className={classes.textField}
                        error={errors.category}
                        value={category}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {[
                            { key: "1", label: "Testcase", value: "testcase" },
                            { key: "2", label: "Testsuit", value: "testsuit" },
                            { key: "3", label: "Bug", value: "bug" },
                            { key: "4", label: "Other", value: "other" }
                        ].map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="selectticketstatus"
                        name="status"
                        select
                        label="Status"
                        className={classes.textField}
                        value={status}
                        error={errors.status}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {[
                            { key: "1", label: "Active", value: "active" },
                            { key: "2", label: "Closed", value: "closed" }
                        ].map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="ticketcomment"
                        label="Comment"
                        name="comment"
                        type="input"
                        style={{ marginLeft: 10, width: "95%" }}
                        margin="normal"
                        multiline={true}
                        value={comment}
                        onChange={this.handleChange}
                        error={errors.comment}
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

const mapStateToProps = ({ SignInReducer, ScriptingReducer, TicketReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    const tStore = TicketReducer;
    return { aStore, gStore, tStore };
}

export default withRouter(connect(mapStateToProps, { ticketPost, ticketPatch })(withStyles(materialStyles)(UserForm)));

