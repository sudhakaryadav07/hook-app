import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog,Grid, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Logger from 'js-logger';

import { workshopValidate } from '../validate';
import { postWorkshop } from '../action';
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

class WorkshopForm extends Component {

    gmodel = { name: "", platform: "", createdBy: "" };

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
            let { userId } = this.props.aStore;
            let { gmodel } = this.state;
            const { name, platform } = gmodel;
            let _model = { name, platform, createdBy: userId, updatedBy: null };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = workshopValidate(_model);
            if (status !== undefined && status.errorFound === false) {
                let response = await this.props.postWorkshop(_model);
                let { status, result } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, "Workshop Created Successfully !");
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, result);
                }
                this.props.resetComponent("gKeyWorkshopForm");
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => {
        this.props.resetComponent("gKeyWorkshopForm");
    }

    render() {
        let { classes } = this.props;
        let { gmodel, errors } = this.state;
        let { name, platform } = gmodel;
        return (
            <Dialog maxWidth="xs" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>Create Workshop</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} style={{ paddingLeft: 0 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                type="input"
                                margin="normal"
                                value={name}
                                onChange={this.handleChange}
                                className={classes.textField}
                                error={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} style={{paddingLeft:0}}>
                            <TextField
                                fullWidth
                                name="platform"
                                select
                                label="Platform"
                                error={errors.platform}
                                className={classes.textField}
                                value={platform}
                                onChange={this.handleChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"
                            >
                                {[{ key: "1", label: "Chrome", value: "chrome" },
                                { key: "2", label: "Firefox", value: "firefox" },
                                { key: "3", label: "IE", value: "ie" }].map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
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

export default withRouter(connect(mapStateToProps, { postWorkshop })(withStyles(materialStyles)(WorkshopForm)));

