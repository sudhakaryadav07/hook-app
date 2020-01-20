import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from "moment";
import Logger from 'js-logger';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, Paper, Button, IconButton, TextField, MenuItem, Fab,
  Stepper, Step, StepContent, StepLabel, Dialog, DialogContentText,
  DialogTitle, DialogContent
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Visibility as VisibilityIcon } from '@material-ui/icons';

import { DeleteModal } from "../scripting/components";
import { TicketForm } from './component/index';

import { ListComponent } from '../scripting/lists';
import { getProject, projectUpdateRequest } from '../scripting/action';
import { ticketUpdateRequest, handleFetchTicketForProject, destroyTicket } from './action';
import { resCode } from '../../config/config';

const materialStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    flexGrow: 1,
    backgroundColor: "#e1e4e1",
  },
  title: {
    flexGrow: 1,
    color: "#185990",
    fontFamily: "monospace",
    fontSize: 25
  },
  smessage: {
    textAlign: 'right',
    flexGrow: 1,
    fontFamily: "monospace",
    fontSize: 15,
    color: 'green',
    position: 'absolute',
    right: '10%',
    fontWeight: 'bolder'
  },
  emessage: {
    textAlign: 'right',
    flexGrow: 1,
    fontFamily: "monospace",
    fontSize: 15,
    color: 'red',
    position: 'absolute',
    right: '10%',
    fontWeight: 'bolder'
  },

  customerContainer: {
    width: "100%",
    margin: 0,
    background: '#ffc680'
  },
  customerPaper1: {
    height: "92vh",
    padding: 2,
    textAlign: 'right',
    color: theme.palette.text.secondary,
    backgroundColor: "#f3dbbe"
  },
  customerPaper3: {
    height: "92vh",
    padding: 2,
    textAlign: 'right',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(255,241,224,1)'
  },
  customerPaper: {
    padding: theme.spacing(0),
    borderRadius: 0,
    textAlign: 'left',
    paddingLeft: 5,
    backgroundColor: '#efd8ae',
    cursor: "pointer"
  },
  customerTitle: {
    padding: theme.spacing(0),
    borderRadius: 0,
    textAlign: 'left',
    paddingLeft: 5,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#8c5005'
  },

  testerContainer: {
    width: "100%",
    margin: 0,
    background: '#2c3e50'
  },
  testerPaper1: {
    height: "92vh",
    padding: 2,
    textAlign: 'right',
    color: theme.palette.text.secondary,
    backgroundColor: "#adb5ba"
  },
  testerPaper3: {
    height: "92vh",
    padding: 2,
    textAlign: 'right',
    color: theme.palette.text.secondary,
    backgroundColor: "#d9dfe2"
  },
  testerPaper: {
    padding: theme.spacing(0),
    borderRadius: 0,
    textAlign: 'left',
    paddingLeft: 5,
    backgroundColor: '#e1e0ea',
    cursor: "pointer"
  },
  testerTitle: {
    padding: theme.spacing(0),
    borderRadius: 0,
    textAlign: 'left',
    paddingLeft: 5,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#2f4f4f'
  },

  button: {
    margin: theme.spacing(1),
    backgroundColor: '#3188a8',
    color: '#fff'
  },
  card: {
    width: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  },
  header: {
    textAlign: 'left',
    height: 80
  },
  list: {
    border: '1px solid grey',
    padding: 0
  },
  listItem: {
    border: '1px solid grey'
  },
  fab: {
    position: 'fixed',
    bottom: 10,
    right: 8,
    backgroundColor: '#008b8b'
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
});

class TicketManagement extends Component {
  gmodel = { username: "", password: "" };

  constructor(props) {
    super(props);
    this.state = {
      gmodel: this.gmodel,
      role: null,
      MODE: null,
      gProjectDetails: null,
      gKeyTicketForm: null,
      gKeyTicketDetails: null,
      gKeyTicketTable: "gKeyTicketTable" + Math.random(),
      gKeyDefault: "gKeyDefault" + Math.random(),
      gKeyRefreshTab: "gKeyRefreshTab" + Math.random(),

      gProjects: [],
      gProject: {},
      gTickets: [],
      gUser: {},
      ticketDetails: null,

      category: "",
      action: "",
      status: "",

      deleteObject: {},
      gKeyDelete: null,

      message: null,
      upDateStatus: "",
      errors: {},

      selectedItem: ''
    };
  }

  refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
  resetComponent = async (key) => this.setState({ [key]: null });

  UNSAFE_componentWillMount() {
    this.handleComponentWillMount();
  }

  UNSAFE_componentWillReceiveProps() {
    setTimeout(() => {
      this.refreshData();
    }, 500);
  }

  refreshData = () => {
    try {
      let { projects } = this.props.gStore;
      let { tickets } = this.props.tStore;
      this.setState({ gProjects: projects, gTickets: tickets });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleComponentWillMount = async () => {
    try {
      let { client } = this.props.gStore;
      let model = { client: client.name };
      await this.props.getProject(model);
      await this.initState();
    } catch (e) {
      console.log(e)
    }
  }

  initState = async () => {
    try {
      let { projects } = this.props.gStore;
      let { role } = this.props.aStore;
      let { tickets } = this.props.tStore;
      await this.setState({ role, gProjects: projects, gTickets: tickets });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleChange = (event) => {
    try {
      const _state = this.state;
      _state[event.target.name] = event.target.value;
      this.setState({ state: _state });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleFilter = async () => {
    let { tickets } = this.props.tStore;
    let { category, action, status } = this.state;
    let filteredTickets = null;
    if (category && action && status) {
      filteredTickets = await tickets.filter((data, i) => {
        if (category === data.category && action === data.action && status === data.status) {
          return data;
        }
        return false;
      });
    }
    if (filteredTickets && filteredTickets.length > 0) {
      await this.setState({ gTickets: filteredTickets });
      await this.refreshComponent('gKeyTicketTable');
    }
  }

  handleReset = async () => {
    let { tickets } = this.props.tStore;
    await this.setState({ gTickets: tickets, category: "", action: "", status: "" });
    await this.refreshComponent('gKeyTicketTable');
  }

  handleDelete = async (data) => {
    try {
      this.setState({ selectedItem: data, deleteObject: data });
      this.refreshComponent("gKeyDelete");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleDeleteCancel = async () => {
    try {
      this.resetComponent("gKeyDelete");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleDeleteOkay = async () => {
    try {
      let { deleteObject } = this.state;

      let response = await this.props.destroyTicket(deleteObject)

      let { status, result } = response;
      if (status === resCode.success) {
        this.props.handleUpdateStatus(status, "Deleted Successfully !");
      } else if (status === resCode.error) {
        this.props.handleUpdateStatus(status, result);
      }

      this.handleDeleteCancel();
    }
    catch (e) {
      Logger.debug(e);
    }
  }

  handleProjectClick = async (data) => {
    try {
      this.resetComponent("gKeyDefault");
      this.props.projectUpdateRequest(data);
      let response = await this.props.handleFetchTicketForProject(data);

      if (response.status === resCode.success) {
        this.setState({ gProject: data, gTickets: response.result });
        this.refreshComponent("gProjectDetails");
      }
      return this.headers;
    } catch (e) {
      Logger.debug(e);
    }
  }

  renderDeleteModal() {
    let { gKeyDelete } = this.state;
    if (gKeyDelete) {
      return (
        <DeleteModal
          key={gKeyDelete}
          handleCancel={this.handleDeleteCancel}
          handleOkay={this.handleDeleteOkay}
        />
      )
    }
  }

  renderList() {
    let { gProjects } = this.state;
    return (
      <ListComponent
        show={'gKeyTicketProject'}
        gProjects={gProjects}
        handleProjectClick={this.handleProjectClick} />
    )
  }


  renderTicketForm() {
    let { MODE, gKeyTicketForm, gProject } = this.state;
    if (gKeyTicketForm) {
      return (
        <TicketForm
          MODE={MODE}
          client={gProject.name}
          key={gKeyTicketForm}
          handleUpdateStatus={this.props.handleUpdateStatus}
          resetComponent={this.resetComponent} />
      );
    }
  }

  handleCreate = async (key) => {
    this.setState({ MODE: 'create' });
    this.refreshComponent(key);
  }

  handleEdit = async (key, data) => {
    this.props.ticketUpdateRequest(data);
    this.setState({ selectedItem: data, MODE: 'edit' });
    this.refreshComponent(key);
  }

  handleView = (data) => {
    this.setState({ selectedItem: data, ticketDetails: data });
    this.refreshComponent('gKeyTicketDetails');
  }

  handleClose = () => {
    this.resetComponent('gKeyTicketDetails');
  }

  renderTicketDetail() {
    let { gKeyTicketDetails, ticketDetails } = this.state;
    if (gKeyTicketDetails) {
      let { comments } = ticketDetails;
      if (comments && comments.length > 0) {
        return (
          <Dialog
            maxWidth="xs"
            open={true}
            onClose={this.handleClose}
            scroll="paper"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="max-width-dialog-title">Comments</DialogTitle>
            <DialogContent dividers='paper' style={{ padding: 0 }}>
              <DialogContentText
                id="scroll-dialog-description">

                <Stepper orientation="vertical">
                  {comments.map((data, i) => {
                    let name = data.modifierName.charAt(0).toUpperCase() + data.modifierName.slice(1)
                    return (
                      <Step key={i}>
                        <StepLabel active={false}>{data.comment}</StepLabel>
                        <StepContent active>
                          <p>{"By " + name + ",  " + moment(data.createdAt).format('Do MMMM YYYY, HH:mm:ss a')}</p>
                        </StepContent>
                      </Step>
                    );
                  })
                  }
                </Stepper>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        );
      }
    }
  }

  handleOnRowClick = (data) => {
    try {
      this.setState({ selectedItem: data });
    } catch (e) {

    }
  }


  renderTickets() {
    let { classes } = this.props;
    let { role, gKeyTicketTable, category, action, status, gTickets, selectedItem } = this.state;

    let paper, title = null;
    paper = (role === "tester") ? classes.testerPaper : classes.customerPaper;
    title = (role === "tester") ? classes.testerTitle : classes.customerTitle;

    if (gKeyTicketTable) {
      if (gTickets && gTickets.length > 0) {
        return (
          <div>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={0}>
                <Grid item xs={2}>
                  <TextField
                   id="selectticketaction"
                    name="action"
                    select
                    style={{ textAlign: 'left', width: "100%" }}
                    label="Action"
                    className={classes.textField}
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
                </Grid>
                <Grid item xs={2}>
                  <TextField
                   id="selectticketcategory"
                    name="category"
                    select
                    label="Category"
                    style={{ textAlign: 'left', width: "100%", marginLeft: 10 }}
                    className={classes.textField}
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
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id="selectticketstatus"
                    name="status"
                    select
                    label="Status"
                    style={{ textAlign: 'left', width: "100%", marginLeft: 20 }}
                    className={classes.textField}
                    value={status}
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
                </Grid>
                <Grid item xs={1}>
                  <Button style={{ textAlign: 'right', backgroundColor: '#2f4f4f', marginLeft: 40 }} variant="contained" id="filterticket" className={classes.button} onClick={this.handleFilter}>Filter</Button>
                </Grid>
                <Grid item xs={1}>
                  <Button style={{ textAlign: 'right', backgroundColor: '#2f4f4f', marginLeft: 60 }} variant="contained" id="resetfilteredticket" className={classes.button} onClick={this.handleReset}>Reset</Button>
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={2}>
                  <Fab color="primary" id="addticket" className={classes.fab} onClick={() => this.handleCreate('gKeyTicketForm')}>
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={0}>
                <React.Fragment>
                  <Grid item xs={1}>
                    <Paper className={title}>Id</Paper>
                  </Grid>
                  <Grid item xs={5}>
                    <Paper className={title}>Description</Paper>
                  </Grid>
                  <Grid item xs={1}>
                    <Paper className={title}>Action</Paper>
                  </Grid>
                  <Grid item xs={1}>
                    <Paper className={title}>Category</Paper>
                  </Grid>
                  <Grid item xs={1}>
                    <Paper className={title}>Status</Paper>
                  </Grid>
                  <Grid item xs={2}>
                    <Paper className={title}>Date</Paper>
                  </Grid>
                  <Grid item xs={1}>
                    <Paper className={title}>Action</Paper>
                  </Grid>
                </React.Fragment>
                {gTickets.map((data, i) => {
                  let { _id, description, action, category, status, createdAt } = data;

                  let background = (selectedItem) ? (_id === selectedItem._id) ? '#7d7c79' : "" : "";
                  let trimmedDescription = (description.length > 75) ? description.substring(0, 75) + "..." : description;

                  return (
                    <React.Fragment key={i} >
                      <Grid item xs={1}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{_id}</Paper>
                      </Grid>
                      <Grid item xs={5}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{trimmedDescription}</Paper>
                      </Grid>
                      <Grid item xs={1}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{action.charAt(0).toUpperCase() + action.slice(1)}</Paper>
                      </Grid>
                      <Grid item xs={1}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{category.charAt(0).toUpperCase() + category.slice(1)}</Paper>
                      </Grid>
                      <Grid item xs={1}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Paper>
                      </Grid>
                      <Grid item xs={2}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>{moment(createdAt).format('MMM Do YYYY')}</Paper>
                      </Grid>
                      <Grid item xs={1}>
                        <Paper className={paper} style={{ backgroundColor: background }} onClick={() => this.handleOnRowClick(data)}>
                          <IconButton onClick={() => this.handleView(data)}>
                            <VisibilityIcon id="viewcomments" style={{ cursor: 'pointer', float: 'right', fontSize: 20, color: 'black' }} />
                          </IconButton>
                          <IconButton onClick={() => this.handleEdit('gKeyTicketForm', data)}>
                            <EditIcon id="editticket" style={{ cursor: 'pointer', float: 'right', marginRight: 5, fontSize: 20, color: 'red' }} />
                          </IconButton>
                          <IconButton onClick={() => this.handleDelete(data)}>
                            <DeleteIcon id="deleteticket" style={{ cursor: 'pointer', float: 'right', fontSize: 20, color: '#348216' }} />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </React.Fragment>
                  )
                }
                )}
              </Grid>
            </Grid>
          </div >
        );
      }
      else {
        return (
          <div>
            <Fab color="primary" id="addticket" className={classes.fab} onClick={() => this.handleCreate('gKeyTicketForm')}>
              <AddIcon />
            </Fab>
          </div>
        )
      }
    }
  }

  renderTabPanel() {
    let { role, gKeyRefreshTab, gKeyDefault } = this.state;
    let { classes } = this.props;

    let paper1, paper3, container = null;
    paper1 = (role === "tester") ? classes.testerPaper1 : classes.customerPaper1;
    paper3 = (role === "tester") ? classes.testerPaper3 : classes.customerPaper3;
    container = (role === "tester") ? classes.testerContainer : classes.customerContainer;

    if (gKeyRefreshTab) {
      return (
        <Grid container spacing={1} className={container}>
          <Grid item xs={12} sm={2}>
            <Paper className={paper1}>
              {this.renderList()}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Paper className={paper3}>
              {(gKeyDefault) ?
                <h4 style={{ paddingTop: '20%', textAlign: 'center' }}>Please Select A Project !</h4> :
                this.renderTickets()}
            </Paper>
          </Grid>
        </Grid>
      );
    }
  }

  render() {
    let { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.renderTabPanel()}
        {this.renderDeleteModal()}
        {this.renderTicketForm()}
        {this.renderTicketDetail()}
      </div>
    );
  }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer, TicketReducer }) => {
  const aStore = SignInReducer;
  const gStore = ScriptingReducer;
  const tStore = TicketReducer;
  return { aStore, gStore, tStore };
}

export default withRouter(connect(mapStateToProps, {
  getProject, projectUpdateRequest, ticketUpdateRequest, handleFetchTicketForProject, destroyTicket
})(withStyles(materialStyles)(TicketManagement)));
