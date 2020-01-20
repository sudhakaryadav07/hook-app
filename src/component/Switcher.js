import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, MenuItem, IconButton, Dialog, DialogActions, DialogContent, TextField, DialogTitle
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const materialStyles = theme => ({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    closebutton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(2),
      color: theme.palette.grey[500],
    },
  });

class Switcher extends Component {

    render() {
        let { classes,client,project,gClients,gProjects } = this.props;
        return (
            <Dialog maxWidth="xs" onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" onClose={() => this.resetComponent('gKeySwitchProjectModel')}>
                    Modal title
                  <IconButton aria-label="close" className={classes.closebutton} onClick={() => this.resetComponent('gKeySwitchProjectModel')}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers style={{ textAlign: 'center', width: 260 }} >
                    <TextField
                        name="client"
                        id="selectclient"
                        select
                        label="Select A Client"
                        style={{ textAlign: 'left' }}
                        className={classes.textField}
                        value={client}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {gClients.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        name="project"
                        id="selectproject"
                        select
                        label="Select A Project"
                        style={{ textAlign: 'left' }}
                        className={classes.textField}
                        value={project}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {gProjects.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={this.props.handleProjectClick} color="primary">
                        Switch
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withRouter(connect(null, {})(withStyles(materialStyles)(Switcher)));
