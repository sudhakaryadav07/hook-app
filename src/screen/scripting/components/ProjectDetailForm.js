import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, Grid } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { resCode } from '../../../config/config';
import { projectDetailsValidate } from '../validate';
import { projectDetailsPatch } from '../action';
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
    },
    input: {
        display: 'none',
    }
});

Logger.useDefaults();

class ProjectDetailForm extends Component {

    gmodel = { buildNo: "", baseUrl: "", gfile: "", updatedBy: "" };

    constructor(props) {
        super(props);
        this.state = {
            gmodel: this.gmodel,
            gProject: this.props.gStore.project,
            errors: {},
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

    handleSubmit = async () => {
        try {
            let { gmodel, gProject } = this.state;
            let { userId } = this.props.aStore;
            let { _id, client } = gProject;
            let { baseUrl, buildNo, gfile } = gmodel;
            let form = new FormData();
            await form.append('file', gfile);
            let model = { _id,client, baseUrl, buildNo, gfile: form, updatedBy: userId };
            let status = projectDetailsValidate(model);
            if (status !== undefined && status.errorFound === false) {
                this.handlePatch(model, form);
            } else {
                this.handleErrors(status.errors);
            }

        } catch (e) {
            Logger.debug(e);
        }
    }

    handlePatch = async (model, form) => {
        try {
            let response = await this.props.projectDetailsPatch(model, form);
            if (response.status === resCode.success) {
                this.props.handleUpdateStatus(response.status, "Project Details Updated !");
                this.props.resetComponent("gKeyProjectDetail");
            } else if (response.status === resCode.error) {
                this.setState({ gmodel: {} });
                this.props.handleUpdateStatus(response.status, "Project Details Not Updated !");
                this.props.resetComponent("gKeyProjectDetail");
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyProjectDetail");

    handleFileChange = (e) => {
        let { gmodel } = this.state;
        this.setState({ gmodel: { ...gmodel, gfile: e.target.files[0] } })
    }


    render() {
        let { classes } = this.props;
        let { gmodel, errors } = this.state;
        let { baseUrl, buildNo, gfile } = gmodel;
        return (
            <Dialog maxWidth="xs" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>Add Project Details</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                             id="buildNo"
                                fullWidth
                                label="Build No"
                                name="buildNo"
                                type="input"
                                margin="normal"
                                value={buildNo}
                                onChange={this.handleChange}
                                error={errors.buildNo}
                                autoFocus={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ paddingLeft: 0 }}>
                            <TextField
                             id="baseUrl"
                                fullWidth
                                name="baseUrl"
                                type="input"
                                label="BaseUrl"
                                margin="normal"
                                value={baseUrl}
                                error={errors.baseUrl}
                                onChange={this.handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={12} style={{ paddingLeft: 8 }}>
                            <input
                                className={classes.input}
                                id="uploadfile"
                                multiple
                                type="file"
                                onChange={this.handleFileChange}
                            />
                            <label htmlFor="contained-button-file" style={{ marginRight: 10 }}>
                                <Button variant="contained" color="primary" component="span"> Upload</Button>
                            </label>
                            {(gfile) ? (gfile.name.length > 40) ? gfile.name.substring(0, 40) + "..." : gfile.name : "Nothing To Upload !"}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.action} style={modal.action}>
                    <Button onClick={this.handleSubmit} color="primary">
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

export default withRouter(connect(mapStateToProps, { projectDetailsPatch })(withStyles(materialStyles)(ProjectDetailForm)));
