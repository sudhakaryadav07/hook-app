import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
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
        padding: 10,
    },
    action: {
        margin: 0,
        padding: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }
});

class CommonForm extends Component {

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

    render() {
        let time = getTime();
        Logger.debug("CommonForm>>>>>>", time);
        let { classes, title, label, name, value, errors, cloneof, MODE } = this.props
        return (
            <Dialog maxWidth="xs" aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header} >
                    <Typography style={modal.headerTitle}>{title}</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={classes.content} style={modal.content}>
                    <TextField
                        id={name}
                        label={label}
                        name={name}
                        type="input"
                        className={classes.textField}
                        value={value}
                        onChange={this.props.handleChange}
                        margin="normal"
                        error={errors}
                        autoFocus={true}
                    />
                    {MODE === "clone" ? <p style={{ paddingLeft: 10, margin: 0, color: '#2e8b57' }}>Clone of {"  " + cloneof}</p> : ""}
                </DialogContent>
                <DialogActions className={classes.action} style={modal.action}>
                    <Button onClick={this.props.handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = ({ ScriptingReducer }) => {
    const gStore = ScriptingReducer;
    return { gStore };
}

export default withRouter(connect(mapStateToProps, {})(withStyles(materialStyles)(CommonForm)));
