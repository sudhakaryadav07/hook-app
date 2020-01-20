import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { projectUpdateRequest } from '../action';
import { modal } from '../../../style/app';
import { validateProject } from '../validate';

const materialStyles = theme => ({
    closebutton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: 9,
        color: 'grey'
    },
    content: {
        padding: 10,
    },
    action: {
        margin: 0,
        padding: theme.spacing(1),
    },
    textField: {
        width: 220,
        marginTop: '10px !important',
    }
});

class SwitchForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            client: "",
            project: "",
            errors: {}
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

    handleClientChange = async (event) => {
        try {
            const _state = this.state;
            _state[event.target.name] = event.target.value;
            let model = { client: event.target.value };
            await this.props.handleFetchProject(model);
            this.setState({ state: _state });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleProjectChange = async (event) => {
        try {
            let { gProjects, gProject } = this.props;
            const _state = this.state;
            _state[event.target.name] = event.target.value;
            await gProjects.map((data, i) => {
                if (event.target.value === data.name) {
                    gProject = data;
                }
                return false;
            })
            await this.props.projectUpdateRequest(gProject);
            await this.props.handleChange(gProject);
            this.setState({ state: _state });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleProjectValidate = async () => {
        try {
            let { client, project } = this.state;
            let _model = { client, project };
            let status = validateProject(_model);
            if (status !== undefined && status.errorFound === false) {
                this.props.handleProjectClick()
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {

        }
    }

    handleErrors = (errors) => this.setState({ errors });

    render() {
        let { client, project, errors } = this.state;
        let { classes, gClients, gProjects } = this.props
        return (
            <Dialog maxWidth="xs" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header} >
                    <Typography style={modal.headerTitle}>Select Project</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={() => this.props.resetComponent('gKeySwitchProjectModel')}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers style={{ textAlign: 'center', width: 260, paddingTop: 0, paddingLeft: 0, paddingRight: 0, backgroundColor: "#dee2e6" }} >
                    <TextField
                        id="selectclient"
                        name="client"
                        select
                        label="Select A Client"
                        style={{ textAlign: 'left' }}
                        className={classes.textField}
                        value={client}
                        error={errors.client}
                        onChange={this.handleClientChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {gClients.map((option, i) => (
                            <MenuItem key={i} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="selectproject"
                        name="project"
                        select
                        label="Select A Project"
                        style={{ textAlign: 'left' }}
                        className={classes.textField}
                        value={project}
                        error={errors.project}
                        onChange={this.handleProjectChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {gProjects.map((option, i) => (
                            <MenuItem key={i} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions style={modal.header}>
                    <Button autoFocus onClick={() => this.handleProjectValidate()} color="primary">
                        Switch
            </Button>
                </DialogActions>
            </Dialog >
        );
    }
}

const mapStateToProps = ({ ScriptingReducer }) => {
    const gStore = ScriptingReducer;
    return { gStore };
}

export default withRouter(connect(mapStateToProps, { projectUpdateRequest })(withStyles(materialStyles)(SwitchForm)));
