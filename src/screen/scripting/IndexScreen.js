import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, CircularProgress, AppBar, Menu, MenuItem, Toolbar, Typography, IconButton, Tooltip, Chip } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

import {
  getClient, clientUpdateRequest, clientDestroy,
  getProject, projectUpdateRequest, projectDestroy,
  getFolder, folderUpdateRequest, folderDestroy,
  getTestcase,setTestcase, getTestcaseDetails, testcaseAddDataset, getCloneTestcaseDetails, testcaseUpdateRequest,
  testcaseDestroy, getTestsuit, testcaseAddStep, testcaseSwipeRequest, copyTestcase, getTestcaseSteps,
  getExecution, patchExecution, postExecution,
  testsuitUpdateRequest, testsuitDestroy, getDataset, getCsvDetails, postCsvDetails
} from './action';

import { logout } from '../usermanagement/action';

import { resCode, latestCommitId } from '../../config/config';

import { ListComponent } from './lists';
import { TestcaseDetailScreen, TestsuitDetailScreen, ProjectDetailScreen } from "./pages";
import { TicketManagement } from "../ticketing/index";

import { TestcaseForm, TestsuitForm, FolderForm, DeleteModal, UploadWidget, SwitchForm } from "./components";

import { getTime } from '../../utils/helper';

const materialStyles = theme => ({
  //Customer's css
  customerRoot: {
    height: '100vh',
    flexGrow: 1,
    backgroundColor: 'rgba(255,198,128,1)'
  },
  customerHeader: {
    minHeight: "40%",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    background: 'linear-gradient(to right, rgba(255,241,224,1) 0%, rgba(255,241,224,1) 30%, rgba(255,198,128,1) 100%)'
  },
  customerContainer: {
    width: "100%",
    margin: 0,
    background: 'rgba(255,198,128,1)'
  },
  customerPaper1: {
    height: "92vh",
    padding: 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: "#f3dbbe"
  },
  customerPaper2: {
    height: "92vh",
    paddingLeft: 7,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(255,241,224,1)',
  },
  customerTitle: {
    flexGrow: 1,
    color: "#7d6f6f",
    fontFamily: "monospace",
    fontSize: 25
  },
  customerMenu: {
    background: 'linear-gradient(to right, rgba(255,241,224,1) 0%, rgba(255,241,224,1) 30%, rgba(255,198,128,1) 100%)',
    marginTop: -8,
    marginBottom: -10
  },

  //Tester's css
  testerRoot: {
    height: '100vh',
    flexGrow: 1,
    backgroundColor: '#2c3e50'
  },
  testerHeader: {
    minHeight: "40%",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    background: 'linear-gradient(to right, #bdc3c7, #2c3e50)'
  },
  testerContainer: {
    width: "100%",
    margin: 0,
    backgroundColor: '#2c3e50'
  },
  testerPaper1: {
    height: "92vh",
    padding: 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: "#adb5ba"
  },
  testerPaper2: {
    height: "92vh",
    paddingLeft: 7,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#d9dfe2',
  },
  testerTitle: {
    flexGrow: 1,
    color: "#f7f3f3",
    fontFamily: "monospace",
    fontSize: 25
  },
  testerMenu: {
    background: 'linear-gradient(to right, #bdc3c7, #708faf)',
    marginTop: -8,
    marginBottom: -10
  },

  progress: {
    top: '47%',
    position: 'absolute',
    margin: '-16',
    color: '#348216'
  },
  appbar: {
    flexGrow: 1,
    backgroundColor: "#454645",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  chip: {
    color: '#f7f3f3',
    border: '2px solid #fbfcff'
  },
  smessage: {
    textAlign: 'right',
    flexGrow: 1,
    fontFamily: "monospace",
    fontSize: 16,
    color: 'green',
    position: 'fixed',
    left: '2%',
    bottom: 8,
    fontWeight: 'bolder'
  },
  emessage: {
    textAlign: 'right',
    flexGrow: 1,
    fontFamily: "monospace",
    fontSize: 16,
    color: 'red',
    position: 'fixed',
    left: '2%',
    bottom: 8,
    fontWeight: 'bolder'
  },
  textField: {
    width: 220,
    marginTop: '10px !important',
  },
  closebutton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(2),
    color: theme.palette.grey[500],
  }
});

Logger.useDefaults();
Logger.setLevel(Logger.INFO);

class IndexScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      role: "tester",

      gClients: [],
      gClient: {},

      gProjects: [],
      gProject: this.props.gStore.project,

      gFolders: [],
      gFolder: {},

      gTestcases: [],
      gTestcase: {},

      gTestsuits: [],
      gTestsuit: {},

      gTestlogs: [],

      gKeyTestsuit: null,
      gKeyTestcase: null,
      gKeyTicket: null,
      gKeyStep: null,
      gKeyTestlog: null,
      gKeyProjectDetails: null,
      gKeyDefault: null,
      gkeyStepLoader: null,
      gKeyUploadWidget: null,
      gRefreshTree: "gRefreshTree" + Math.random(),
      MODE: null,

      gKeyFolderForm: null,
      gKeyTestcaseForm: null,
      gKeyTestsuitForm: null,
      gKeySwitchProjectModel: null,

      deleteObject: {},
      gKeyDelete: null,
      gkeyLoader: null,

      upDateStatus: "",
      upDateStatusMessage: "",

      openMenu: false,
      page: "",
      currentTarget: null,

      client: "Select Client",
      project: "Select Project"
    };
  }

  refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
  resetComponent = async (key) => this.setState({ [key]: null });

  UNSAFE_componentWillMount() {
    this.handleComponentWillMount();
  }

  handleComponentWillMount = async () => {
    try {
      await this.props.getExecution();
      let model = { swipe: false }
      await this.props.testcaseSwipeRequest(model);
      await this.initState();
      document.addEventListener("keypress", this.handleKeypress, false);
    } catch (e) {
      console.log(e)
      Logger.debug(e);
    }
  }

  initState = async () => {
    try {
      let { page } = this.state;
      let { aStore, gStore } = this.props;
      let { role } = aStore;
      let { clients, folders, testcases } = gStore;
      page = (role === "customer") ? "Testsuit" : "Testcase";
      this.setState({ page, role, gClients: clients, gFolders: folders, gTestcases: testcases });
      if (role === "tester") {
        await this.refreshComponent('gKeyTestcase');
      } else if (role === "customer") {
        await this.refreshComponent('gKeyTestsuit');
      }
      await this.refreshComponent('gKeyDefault');
    } catch (e) {
      Logger.debug(e);
    }
  }

  UNSAFE_componentWillReceiveProps() {
    setTimeout(() => {
      this.refreshData();
      this.refreshComponent('gRefreshTree');
      this.handleViewTestSuitStatus();
    }, 500);
  }

  refreshData = async () => {
    Logger.debug("refreshData>>>>>>>", getTime())
    try {
      let { clients, projects, folders, testcases, testcase } = this.props.gStore;

      let tclients = await clients.map((data, i) => {
        return { ...data, key: data._id, label: data.name, value: data.name };
      });

      let tprojects = await projects.map((data, i) => {
        return { ...data, key: data._id, label: data.name, value: data.name };
      });

      this.setState({ gClients: tclients, gProjects: tprojects, gFolders: folders, gTestcases: testcases, gTestcase: testcase });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleViewTestSuitStatus = async () => {
    try {
      Logger.debug("handleViewTestSuitStatus>>>>>>>", getTime())
      let { testsuits, executions } = this.props.gStore;
      testsuits = await testsuits.map((ts) => {

        let isFound = false;
        let statusFound = "";

        executions.map((ex) => {
          if (ex.suite === ts.desc) {
            isFound = true;
            statusFound = ex.status;
            return true;
          }
          return ex;
        });

        if (isFound === true) {
          isFound = false;
          return { ...ts, status: statusFound };
        }
        return ts;
      });
      await this.setState({ gTestsuits: testsuits });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleChange = async (gProject) => {
    try {
      this.setState({ gProject });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleFetchProject = async (_model) => {
    Logger.debug("handleFetchProject>>>>>>>", getTime())
    try {
      this.refreshComponent("gkeyLoader");
      let response = await this.props.getProject(_model)
      if (response && response.status === resCode.success) {
        this.setState({ gProjects: response.result });
      }
      this.resetComponent("gkeyLoader");
    } catch (e) {
      Logger.debug(e);
    }
  }

  //handle Project click for Testcase click
  handleProjectClick = async () => {
    try {
      let { role, gProject } = this.state;
      if (role === "tester") {
        await this.handleFetchFolders(gProject);
        await this.handleFetchTestcase(gProject);
        await this.handleFetchTestsuit(gProject);
        this.resetComponent("gKeySwitchProjectModel");
        this.resetComponent("gKeyStep");
        this.refreshComponent("gKeyDefault");
        this.refreshComponent("gKeyTestcase");
      } else if (role === "customer") {
        await this.handleFetchTestsuit(gProject);
        this.resetComponent("gKeySwitchProjectModel");
        this.resetComponent("gKeyStep");
        this.refreshComponent("gKeyDefault");
        this.refreshComponent("gKeyTestsuit");
      }
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleFetchFolders = async (data) => {
    try {
      let _modal = { project: data._id };
      await this.props.getTestcase(_modal)
      let response = await this.props.getFolder(_modal);
      if (response && response.status === resCode.success) {
        this.setState({ gFolders: response.result });
      }
      this.resetComponent("gkeyLoader");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleFetchTestcase = async (data) => {
    Logger.debug("handleFetchTestcase>>>>>>>", getTime())
    try {
      let _modal = { project: data._id };
      this.refreshComponent("gkeyLoader");
      let response = await this.props.getTestcase(_modal)
      if (response && response.status === resCode.success) {
        this.setState({ gTestcases: response.result });
      }
      this.resetComponent("gkeyLoader");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleFetchTestsuit = async (data) => {
    Logger.debug("handleFetchTestsuit>>>>>>>", getTime())
    try {
      let _modal = { project: data._id };
      let response = await this.props.getTestsuit(_modal)
      if (response && response.status === resCode.success) {
        this.setState({ gTestsuits: response.result });
      }
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleFolderClick = async (data) => {
    try {
      await this.refreshComponent("gkeyStepLoader");
      await this.props.folderUpdateRequest(data);
      this.setState({ gFolder: data });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleTestcaseClick = async (data) => {
    Logger.debug("handleTestcaseClick>>>>>>>", getTime())
    try {
      let { cloneof } = data;
      await this.refreshComponent("gkeyStepLoader");
      await this.props.testcaseUpdateRequest(data);
      await this.props.setTestcase(data);
      let model = { testcase: data._id, project: data.project };
      await this.props.getDataset(model);
      let response = (!cloneof) ? await this.props.getTestcaseDetails(data) : await this.props.getCloneTestcaseDetails(data);
      if (response && response.status === resCode.success) {
        await this.setState({  gTestcase: response.result });
      }
      this.refreshComponent("gKeyStep");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleSwitchProject = (page) => {
    this.setState({ page, currentTarget: null, openMenu: false });
    this.refreshComponent('gKeySwitchProjectModel');
  }

  showTestcase = async (page) => {
    try {
      this.setState({ page, currentTarget: null, openMenu: false })
      let { gProject } = this.state;
      let model = { swipe: false }
      await this.props.testcaseSwipeRequest(model);
      await this.handleFetchFolders(gProject);
      await this.handleFetchTestcase(gProject);
      this.resetComponent("gKeyTestsuit");
      this.resetComponent("gKeyTicket");
      this.resetComponent("gKeyStep");
      this.resetComponent("gKeyTestlog");
      this.refreshComponent("gKeyDefault");
      this.refreshComponent("gKeyTestcase");
    } catch (e) {
      Logger.debug(e);
    }
  }

  //handle Testsuit click
  showTestsuit = async (page) => {
    try {
      this.setState({ page, currentTarget: null, openMenu: false })
      let { gProject } = this.state;
      await this.handleFetchFolders(gProject);
      await this.handleFetchTestsuit(gProject);
      this.resetComponent("gKeyTestcase");
      this.resetComponent("gKeyTicket");
      this.resetComponent("gKeyStep");
      this.resetComponent("gKeyTestlog");
      this.refreshComponent("gKeyDefault");
      this.refreshComponent("gKeyTestsuit");
    } catch (e) {
      Logger.debug(e);
    }
  }

  //handle Ticket click
  showTicket = async (page) => {
    try {
      this.setState({ page, currentTarget: null, openMenu: false })
      this.resetComponent("gKeyTestcase");
      this.resetComponent("gKeyTestsuit");
      this.resetComponent("gKeyDefault");
      this.resetComponent("gKeyStep");
      this.refreshComponent("gKeyTicket");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleTestsuitClick = async (data) => {
    try {
      this.props.testsuitUpdateRequest(data);
      this.resetComponent("gKeyDefault");
      this.resetComponent("gKeyStep");
      this.refreshComponent("gKeyTestlog");
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleCreateForm = (key, action) => {
    Logger.debug("handleCreateForm>>>>>>>", getTime())
    try {
      if (key === "gKeyFolderForm") {
        key = "gKeyFolderForm";
      } else if (key === "gKeyTestcaseForm") {
        key = "gKeyTestcaseForm";
      } else if (key === "gKeyTestsuitForm") {
        key = "gKeyTestsuitForm";
      }
      this.setState({ [key]: key + Math.random(), MODE: action });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleEditForm = (key, action, data) => {
    try {
      if (key === "gKeyFolderForm") {
        this.props.folderUpdateRequest(data);
      } else if (key === "gKeyTestcaseForm") {
        this.props.testcaseUpdateRequest(data);
      } else if (key === "gKeyTestsuitForm") {
        this.props.testsuitUpdateRequest(data);
      }
      this.setState({ [key]: key + Math.random(), MODE: action });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleTestsuitExection = async (item) => {
    Logger.debug("handleTestsuitExection>>>>>>>", getTime())
    try {
      let date = moment().format('YYYYMMDD');
      let time = moment().format('HHmmss');
      let executionId = date + "-" + time;
      let { client, project } = this.props.gStore;
      let { userId } = this.props.aStore;

      let _model = {
        client: client._id, project: project._id, suiteId: item._id, suite: item.desc,
        platform: item.platform, status: "queued", executionId, createdBy: userId, updatedBy: null
      };

      let response = await this.props.postExecution(_model);
      await this.props.getExecution();
      let { status } = response;
      if (status === resCode.success) {
        this.handleUpdateStatus(status, "Testsuit Queued");
      } else if (status === resCode.error) {
        this.handleUpdateStatus(status, "Testsuit Exists");
      }
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleTestsuitAbort = async (item) => {
    Logger.debug("handleTestsuitAbort>>>>>>>", getTime())
    try {
      let { userId } = this.props.aStore;
      let _model = { suiteId: item._id, suite: item.desc, status: "aborted", updatedBy: userId };
      let response = await this.props.patchExecution(_model);
      await this.props.getExecution();
      let { status } = response;
      if (status === resCode.success) {
        this.handleUpdateStatus(status, "Testsuit Aborted");
      } else if (status === resCode.error) {
        this.handleUpdateStatus(status, "Testsuit Exists");
      }
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleCopyTestcase = async (item) => {
    try {

      let { gStore } = this.props;
      if (gStore.testcase._id !== item._id) {
        let getTestcase = await this.props.getTestcaseSteps(item);
        let response = await this.props.copyTestcase({ ...getTestcase.result, _id: gStore.testcase._id });
        let { status } = response;
        if (status === resCode.success) {
          this.handleUpdateStatus(status, "Testcase Copied Successfully !");
        } else if (status === resCode.error) {
          this.handleUpdateStatus(status, "Copy Testcase Unsuccessful !");
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  handleDelete = async (data) => {
    try {
      this.setState({ deleteObject: data });
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
      let { model } = deleteObject;
      let response = null;
      if (model === 'project') {
        response = await this.props.projectDestroy(deleteObject)
      } else if (model === 'folder') {
        response = await this.props.testcaseUpdateRequest({});
        response = await this.props.folderDestroy(deleteObject);
      } else if (model === 'testcase') {
        response = await this.props.testcaseUpdateRequest({});
        response = await this.props.testcaseDestroy(deleteObject);
      } else if (model === 'testsuit') {
        response = await this.props.testsuitDestroy(deleteObject);
      }

      this.resetComponent('gKeyStep');
      this.resetComponent('gKeyTestlog');
      this.refreshComponent('gKeyDefault');

      let { status, result } = response;
      if (status === resCode.success) {
        this.handleUpdateStatus(status, "Deleted Successfully !");
      } else if (status === resCode.error) {
        this.handleUpdateStatus(status, result);
      }

      this.handleDeleteCancel();
    }
    catch (e) {
      Logger.debug(e);
    }
  }

  handleMenuClick = (event) => {
    try {
      this.setState({ currentTarget: event.currentTarget, openMenu: Boolean(event.currentTarget) });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleUploadCSV = async () => {
    try {
      this.refreshComponent('gKeyUploadWidget');
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleCloseMenu = () => {
    try {
      this.setState({ currentTarget: null, openMenu: false });
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleUpdateStatus = async (status, message) => {
    try {
      this.setState({ upDateStatus: status, upDateStatusMessage: message });
      setTimeout(() => {
        this.setState({ upDateStatus: false, upDateStatusMessage: "" });
      }, 5000)
    } catch (e) {
      Logger.debug(e);
    }
  }

  handleLogout = async () => {
    await this.props.logout();
    this.props.history.push('/');
  }

  renderLoader() {
    let { gkeyLoader } = this.state;
    const { classes } = this.props;
    if (gkeyLoader) {
      return <CircularProgress className={classes.progress} />
    }
  }

  renderDeleteModal() {
    Logger.debug("renderDeleteModal>>>>>>>", getTime())
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
    Logger.debug("renderList>>>>>>>", getTime());
    let { role, gKeyTestcase, gKeyTestsuit, gTestcases, gTestsuits, gFolders, gRefreshTree } = this.state;
    let show = "";
    if (gKeyTestcase) {
      show = "gKeyTestcase"
    } else if (gKeyTestsuit) {
      show = "gKeyTestsuit"
    }

    return (
      <ListComponent
        role={role}
        show={show}
        gFolders={gFolders}
        gTestcases={gTestcases}
        gTestsuits={gTestsuits}
        handleFolderClick={this.handleFolderClick}
        handleTestcaseClick={this.handleTestcaseClick}
        handleTestsuitClick={this.handleTestsuitClick}

        gRefreshTree={gRefreshTree}
        handleDelete={this.handleDelete}
        handleCreateForm={this.handleCreateForm}
        handleEditForm={this.handleEditForm}
        refreshComponent={this.refreshComponent}
        handleTestsuitAbort={this.handleTestsuitAbort}
        handleCopyTestcase={this.handleCopyTestcase}
        handleUploadCSV={this.handleUploadCSV}
        handleTestsuitExection={this.handleTestsuitExection}
      />
    )
  }

  renderTestcaseForm() {
    Logger.debug("renderTestcaseForm>>>>>>", getTime());
    let { gKeyTestcaseForm, MODE } = this.state;
    if (gKeyTestcaseForm) {
      return (
        <TestcaseForm
          MODE={MODE}
          key={gKeyTestcaseForm}
          resetComponent={this.resetComponent}
          refreshComponent={this.refreshComponent}
          handleUpdateStatus={this.handleUpdateStatus} />
      );
    }
  }

  renderTestsuitForm() {
    Logger.debug("renderTestsuitForm>>>>>>", getTime());
    let { gKeyTestsuitForm, MODE, gTestcases } = this.state;
    if (gKeyTestsuitForm) {
      return (
        <TestsuitForm
          MODE={MODE}
          key={gKeyTestsuitForm}
          gTestcases={gTestcases}
          resetComponent={this.resetComponent}
          refreshComponent={this.refreshComponent}
          handleUpdateStatus={this.handleUpdateStatus} />
      );
    }
  }

  renderFolderForm() {
    let { gKeyFolderForm, MODE, gFolders } = this.state;
    if (gKeyFolderForm) {
      return (
        <FolderForm
          MODE={MODE}
          TYPE="general"
          key={gKeyFolderForm}
          gFolders={gFolders}
          resetComponent={this.resetComponent}
          refreshComponent={this.refreshComponent}
          handleUpdateStatus={this.handleUpdateStatus} />
      );
    }
  }

  renderDynamicScreen() {
    let { classes } = this.props;
    let { role, gProject,  gTestcase, gTestlogs, gKeyStep, gKeyDefault, gKeyTestlog } = this.state;

    let paper2 = (role === "tester") ? classes.testerPaper2 : classes.customerPaper2;

    if (gKeyStep) {
      return (
        <TestcaseDetailScreen
          gProject={gProject}
          gTestcase={gTestcase}
          gkeyStepLoader={this.state.gkeyStepLoader}
          refreshComponent={this.refreshComponent}
          handleUpdateStatus={this.handleUpdateStatus}
        />
      );
    } else if (gKeyTestlog) {
      return (
        <TestsuitDetailScreen
          gTestlogs={gTestlogs}
          gkeyStepLoader={this.state.gkeyStepLoader}
          refreshComponent={this.refreshComponent}
          handleUpdateStatus={this.handleUpdateStatus}
        />
      );
    } else if (gKeyDefault) {
      return (
        <Paper className={paper2}>
          <h4 style={{ paddingTop: '25%' }}>Welcome To Our Scripting App !</h4>
        </Paper>
      );
    }
  }

  renderDashBoard() {
    let { role, gProject, gKeyTestcase, gKeyTestsuit, gKeyTicket, gkeyLoader, gKeyProjectDetails } = this.state;
    const { classes, gStore } = this.props;
    let { swapTestcasePage } = gStore;

    let a = (swapTestcasePage === true) ? 0 : 4;
    let b = (swapTestcasePage === true) ? 12 : 8;

    let container, paper1 = null;

    container = (role === "tester") ? classes.testerContainer : classes.customerContainer;
    paper1 = (role === "tester") ? classes.testerPaper1 : classes.customerPaper1;

    if (gKeyTestcase) {
      return (
        <Grid container spacing={1} className={container}>
          {(swapTestcasePage === false) ?
            <Grid item xs={12} sm={a} style={{ padding: 3 }}>
              <Paper className={paper1}>
                {(gkeyLoader) ? this.renderLoader() : this.renderList()}
              </Paper>
            </Grid> : null}
          <Grid item xs={12} sm={b} style={{ padding: 3 }}>
            {this.renderDynamicScreen()}
          </Grid>
        </Grid>
      )
    } else if (gKeyTestsuit) {
      return (
        <Grid container spacing={1} className={container}>
          <Grid item xs={12} sm={2} style={{ padding: 3 }}>
            <Paper className={paper1}>
              {this.renderList()}
              {this.renderLoader()}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={10} style={{ padding: 3 }}>
            {this.renderDynamicScreen()}
          </Grid>
        </Grid>
      )
    } else if (gKeyTicket) {
      return <TicketManagement
        handleUpdateStatus={this.handleUpdateStatus} />
    } else if (gKeyProjectDetails) {
      return <Grid item xs={12} style={{ padding: 3 }}>
        <ProjectDetailScreen
          handleUpdateStatus={this.handleUpdateStatus}
          role={role}
          gProject={gProject} />
      </Grid>
    }
  }

  handleViewProject = () => {
    try {
      this.setState({ currentTarget: null, openMenu: false })
      this.resetComponent('gKeyTestcase');
      this.resetComponent('gKeyTestsuit');
      this.resetComponent('gKeyTicket');
      this.resetComponent('gKeyDefault');
      this.refreshComponent('gKeyProjectDetails')
    } catch (e) {

    }
  }

  renderAppBar() {
    let { aStore, gStore, classes } = this.props;
    let { username } = aStore;
    let { page, role, openMenu, currentTarget, upDateStatus, upDateStatusMessage } = this.state;

    let title = (role === "tester") ? classes.testerTitle : classes.customerTitle;
    let header = (role === "tester") ? classes.testerHeader : classes.customerHeader;

    return (
      <AppBar className={classes.appbar} position="static">
        <Toolbar className={header}>
          <Tooltip title={latestCommitId} placement="top">
            <Typography variant="h6" className={title}>
              <img className="logo" alt="" src={require("../../icon/alfalab.png")} />
            </Typography>
          </Tooltip>

          <Typography variant="h6" className={title}>
            {gStore.client.name + " | " + gStore.project.name}
          </Typography>
          {(upDateStatus === resCode.success) ?
            <Typography className={classes.smessage}> {upDateStatusMessage} </Typography> :
            <Typography className={classes.emessage}>  {upDateStatusMessage} </Typography>}
          <Typography  variant="h6" style={{ textAlign: 'right', color: "#f7f3f3", marginRight: 20, fontFamily: "monospace" }}>
            {page}
          </Typography>
          <div>

            <IconButton edge="start" onClick={this.handleMenuClick} className={classes.menuButton} color="inherit" id="hamburgermenu">
              <MenuIcon />
            </IconButton>
            <Chip variant="outlined" className={classes.chip} label={"Logout " + username} color="primary" id="logout" clickable={true} onClick={this.handleLogout} />
            {(role === "tester") ?
              <Menu
                id="menu-appbar"
                anchorEl={currentTarget}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openMenu}
                onClose={this.handleCloseMenu}>
                <MenuItem className={classes.testerMenu} value="Switch Project" onClick={() => this.handleSwitchProject('Switch Project')}>Switch Project</MenuItem>
                <MenuItem className={classes.testerMenu} value="Project Details" onClick={() => this.handleViewProject('Project Details')}>Project Details</MenuItem>
                <MenuItem className={classes.testerMenu} value="Testcase" onClick={() => this.showTestcase('Testcase')}>Testcase</MenuItem>
                <MenuItem className={classes.testerMenu} value="Testsuit" onClick={() => this.showTestsuit('Testsuit')}>Testsuit</MenuItem>
                <MenuItem className={classes.testerMenu} value="Ticket" onClick={() => this.showTicket('Ticket')}>Ticket</MenuItem>
              </Menu> :
              <Menu
                id="menu-appbar"
                anchorEl={currentTarget}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openMenu}
                onClose={this.handleCloseMenu}>
                <MenuItem className={classes.customerMenu} value="Switch Project" onClick={() => this.refreshComponent('gKeySwitchProjectModel')}>Switch Project</MenuItem>
                <MenuItem className={classes.customerMenu} value="Project Details" onClick={() => this.handleViewProject('Project Details')}>Project Details</MenuItem>
                <MenuItem className={classes.customerMenu} value="Testsuit" onClick={() => this.showTestsuit('Testsuit')}>Testsuit</MenuItem>
                <MenuItem className={classes.customerMenu} value="Ticket" onClick={() => this.showTicket('Ticket')}>Ticket</MenuItem>
              </Menu>
            }
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  renderSwitchProjectModel() {
    let { gClients, gProjects, gProject, gKeySwitchProjectModel } = this.state;
    if (gKeySwitchProjectModel) {
      return (
        <SwitchForm
          gClients={gClients}
          gProjects={gProjects}
          gProject={gProject}
          handleChange={this.handleChange}
          handleFetchProject={this.handleFetchProject}
          handleProjectClick={this.handleProjectClick}
          resetComponent={this.resetComponent}
        />
      );
    }
  }

  handleStepperClose = () => {
    this.resetComponent('gKeyUploadWidget');
  }


  renderTestcaseUploadWidget() {
    let { gKeyUploadWidget, gProject } = this.state;
    if (gKeyUploadWidget) {
      return (
        <UploadWidget
          title="Upload Testcases"
          gProject={gProject}
          handleProjectClick={this.handleProjectClick}
          handleStepperClose={this.handleStepperClose}
        />
      );
    }
  }

  render() {
    const { role } = this.state;
    const { classes } = this.props;
    let root = (role === "tester") ? classes.testerRoot : classes.customerRoot;

    return (
      <div className={root}>
        {this.renderAppBar()}
        {this.renderDashBoard()}
        {this.renderTestcaseForm()}
        {this.renderTestsuitForm()}
        {this.renderFolderForm()}
        {this.renderDeleteModal()}
        {this.renderTestcaseUploadWidget()}
        {this.renderSwitchProjectModel()}
      </div>
    );
  }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
  const gStore = ScriptingReducer;
  const aStore = SignInReducer;
  return { aStore, gStore };
}

export default withRouter(connect(mapStateToProps, {
  getClient, clientUpdateRequest, clientDestroy,
  getProject, projectUpdateRequest, projectDestroy,
  getFolder, folderUpdateRequest, folderDestroy,
  getTestcase, getTestcaseDetails, testcaseAddDataset, getCloneTestcaseDetails, testcaseUpdateRequest,
  testcaseDestroy, getTestsuit, testcaseAddStep,setTestcase, testcaseSwipeRequest, copyTestcase, getTestcaseSteps,
  getExecution, patchExecution, postExecution,
  testsuitUpdateRequest, testsuitDestroy, getDataset, getCsvDetails, postCsvDetails, logout
})(withStyles(materialStyles)(IndexScreen)));
