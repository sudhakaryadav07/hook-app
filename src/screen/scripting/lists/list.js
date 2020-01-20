import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

import { withStyles } from '@material-ui/core/styles';
import { List, ListItemSecondaryAction, ListItem, ListItemText, Tooltip, IconButton } from '@material-ui/core';
import {
    Delete as DeleteIcon, Stop as StopIcon, PlayArrow as PlayArrowIcon, Publish as PublishIcon,
    Edit as EditIcon, AddCircle, WorkOutline as WorkOutlineIcon, CreateNewFolder as CreateNewFolderIcon,
    Visibility as VisibilityIcon, Computer as ComputerIcon, RestorePage, Replay
} from '@material-ui/icons';

import TestcaseTree from './tree';

import { getTime } from '../../../utils/helper';

const materialStyles = theme => ({
    card: {
        minWidth: 200,
    },
    title: {
        flexGrow: 1,
        color: "#185990",
        fontFamily: "monospace",
        fontSize: 25
    },
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(1),
    }
});

Logger.useDefaults();

class ListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: '',
            selectedAItem: ''
        };
    }

    handleTestsuitAbort = async (item) => {
        try {
            await this.props.handleTestsuitAbort(item);
        } catch (e) {
            Logger.debug(e);
        }
    }

    renderActionButtons(show, action, form) {
        let { role } = this.props;
        if (show === 'gKeyTestsuit') {
            return (
                <ListItemSecondaryAction>
                    {role === "tester" ? <IconButton style={{ padding: 0, color: '#008b8b' }} edge="end" id="addtestsuit" onClick={() => this.props.handleCreateForm(form, action)}>
                        <AddCircle fontSize="small" />
                    </IconButton> : null}
                </ListItemSecondaryAction>
            );
        }
        if (show === 'gAKeyClient' || show === 'gKeyProject' || show === 'gKeyTestsuit' || show === 'gKeyWorkshop') {

            let label = null;

            if (show === 'gAKeyClient') {
                label = "addclient";
            } else if (show === 'gKeyProject') {
                label = "addproject";
            } else if (show === 'gKeyTestsuit') {
                label = "addtestsuit";
            } else if (show === 'gKeyWorkshop') {
                label = "addworkshop";
            }

            return (
                <ListItemSecondaryAction>
                    <IconButton style={{ padding: 0, color: '#008b8b' }} edge="end" id={label} onClick={() => this.props.handleCreateForm(form, action)}>
                        <AddCircle fontSize="small" />
                    </IconButton>
                </ListItemSecondaryAction>
            );
        } else if (show === 'gKeyTestcase') {
            return (
                <ListItemSecondaryAction>
                    {/* <IconButton style={{ padding: 0, marginRight: 5, color: '#265fe4' }} edge="end" id="add" onClick={() => this.props.handleUndoTestcase()}> */}
                    <IconButton style={{ padding: 0, marginRight: 5, color: '#265fe4' }} edge="end" id="undo" >
                        <RestorePage fontSize="small" />
                    </IconButton>
                    <IconButton style={{ padding: 0, marginRight: 5, color: '#2f4f4f' }} edge="end" id="uploadtestcase" onClick={() => this.props.handleUploadCSV()}>
                        <PublishIcon fontSize="small" />
                    </IconButton>
                    <IconButton style={{ padding: 0, color: '#f9de53' }} edge="end" id="addfolder" onClick={() => this.props.handleCreateForm('gKeyFolderForm', 'create')}>
                        <CreateNewFolderIcon fontSize="small" />
                    </IconButton>
                </ListItemSecondaryAction>
            );
        } else if (show === 'gKeyTicketProject') {
            return null;
        }

    }

    renderListHead() {
        try {
            let { show, gClients, gTestcases, gFolders, gProjects, gTestsuits, gWorkshops } = this.props;
            let title, form, action = null; let folder, count = "";
            if (show === "gKeyClient") {
                count = gClients.length;
                title = "Clients";
                form = "gKeyClientForm"
            }

            else if (show === "gAKeyClient") {
                count = gClients.length;
                title = "Clients";
                form = "gAKeyClientForm"
                action = "create";
            }

            else if (show === "gKeyProject") {
                count = gProjects.length;
                title = "Projects";
                form = "gKeyProjectForm"
                action = "create";
            }

            else if (show === "gKeyTestcase") {
                count = gTestcases.length;
                folder = gFolders.length;
                title = "Testcases";
                form = "gKeyTestcaseForm"
                action = "create";
            }

            else if (show === "gKeyTestsuit") {
                count = gTestsuits.length;
                title = "Testsuits";
                form = "gKeyTestsuitForm"
                action = "create";
            }

            else if (show === "gKeyTicketProject") {
                count = gProjects.length;
                title = "Projects";
            }

            if (show === "gKeyWorkshop") {
                count = gWorkshops.length;
                title = "Workshops";
                form = "gKeyWorkshopForm"
            }

            if (show === 'gKeyTestcase') {
                return (
                    <List style={{ padding: 0 }}>
                        <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 5, color: 'black' }}>
                            <ListItemText style={{ marginTop: 0, marginBottom: 0 }} primary={folder + " Folders" + ", " + count + " " + title} />
                            {this.renderActionButtons(show, action, form)}
                        </ListItem>
                    </List >
                );
            }
            return (
                <List style={{ padding: 0 }}>
                    <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 5, color: 'black' }}>
                        <ListItemText style={{ marginTop: 0, marginBottom: 0 }} primary={count + " " + title} />
                        {this.renderActionButtons(show, action, form)}
                    </ListItem>
                </List >
            );
        } catch (e) {
            Logger.debug(e);
        }
    }

    renderTestsuitStatus(item) {
        let { status } = item
        if (!status || status === "completed" || status === "aborted" || status === 'failed') {
            return (
                <IconButton style={{ padding: 0, marginRight: 6, color: '#2ae827' }} edge="end" id="edittestsuit" onClick={() => this.props.handleTestsuitExection(item)} >
                    <PlayArrowIcon fontSize="small" />
                </IconButton>
            );
        } else if (status === "queued") {
            return (
                <IconButton style={{ padding: 0, marginRight: 6, color: 'yellow' }} edge="end" id="edittestsuit" onClick={() => this.handleTestsuitAbort(item)} >
                    <StopIcon fontSize="small" />
                </IconButton>
            );
        } else if (status === "running" || status === "readytorun") {
            return (
                <IconButton style={{ padding: 0, marginRight: 6, color: 'red' }} edge="end" id="edittestsuit" onClick={() => this.handleTestsuitAbort(item)} >
                    <StopIcon fontSize="small" />
                </IconButton>
            );
        }
    }

    renderEdit(item) {
        let { show } = this.props;
        let label, key = "";
        if (show === "gKeyClient") {
            key = "gKeyClientForm";
        } else if (show === "gKeyProject") {
            key = "gKeyProjectForm";
            label = "editproject";
        } else if (show === "gKeyTestcase") {
            key = "gKeyTestcaseForm";
            label = "edittestcase";
        } else if (show === "gKeyTestsuit") {
            key = "gKeyTestsuitForm";
            label = "edittestsuit";
        } else if (show === "gAKeyClient") {
            key = "gAKeyClientForm";
            label = "editclient";
        } else if (show === "gKeyWorkshop") {
            key = "gKeyWorkshopForm";
            label = "editworkshop"
        }

        if (show !== "gKeyClient") {
            return (
                <IconButton style={{ padding: 0, marginRight: 5, color: 'red' }} edge="end" id={label} onClick={() => this.props.handleEditForm(key, "edit", item)} >
                    <EditIcon fontSize="small" />
                </IconButton>
            );
        } else {
            return null;
        }

    }

    renderDelete(item, model) {
        let { show } = this.props;
        let data = { ...item, model };
        if (show !== "gKeyClient") {
            return (
                <IconButton style={{ padding: 0, color: '#348216' }} edge="end" id={"delete"+model} onClick={() => this.props.handleDelete(data)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            );
        } else {
            return null;
        }
    }

    renderPlatformIcon(item) {
        if (item.platform === "chrome") {
            return (
                <IconButton style={{ padding: 0, marginRight: 6, color: '#a52a2a' }} edge="end" id="chrome">
                    <img height="21px" width="21px" alt="" src={require("../../../icon/chrome.png")} />
                </IconButton>
            );
        } else if (item.platform === "firefox") {
            return (
                <IconButton style={{ padding: 0, marginRight: 9, color: '#a52a2a' }} edge="end" id="firefox">
                    <img height="18px" width="18px" alt="" src={require("../../../icon/firefox.png")} />
                </IconButton>
            );
        } else if (item.platform === "ie") {
            return (
                <IconButton style={{ padding: 0, marginRight: 9, color: '#a52a2a' }} edge="end" id="ie">
                    <img height="18px" width="18px" alt="" src={require("../../../icon/ie.png")} />
                </IconButton>
            );
        }
    }


    handleOnClientClick = async (client) => {
        try {
            this.props.handleClientClickForUser(client);
            this.setState({ selectedAItem: "", selectedItem: client });
        } catch (e) {

        }
    }

    handleOnProjectClick = async (project) => {
        try {
            this.props.handleProjectClick(project)
            this.setState({ selectedItem: project });
        } catch (e) {

        }
    }

    handleOnAClientClick = async (client) => {
        try {
            this.props.handleClientClickForProject(client)
            this.setState({ selectedAItem: client });
        } catch (e) {

        }
    }


    handleOnTestsuitClick = async (testsuit) => {
        try {
            this.props.handleTestsuitClick(testsuit);
            this.setState({ selectedItem: testsuit });
        } catch (e) {

        }
    }

    handleOnTicketClick = async (project) => {
        try {
            this.props.handleProjectClick(project);
            this.setState({ selectedItem: project });
        } catch (e) {

        }
    }

    handleOnWorkshopClick = async (workshop) => {
        try {
            this.props.handleWorkshopClick(workshop);
            this.setState({ selectedAItem: "", selectedItem: workshop });
        } catch (e) {

        }
    }

    renderListBody() {
        let { selectedItem, selectedAItem } = this.state;
        let { show, gClients, gProjects, gTestsuits, gWorkshops } = this.props;
        try {
            if (show === "gKeyClient") {
                if (gClients && gClients.length > 0) {
                    return (
                        <List component="nav" id="list" style={{ padding: 0 }}>
                            {gClients.map((item, idx) => {

                                let background = (selectedItem) ? (item._id === selectedItem._id) ? '#7d7c79' : "" : "";
                                let trimmedClient = (item.name.length > 22) ? item.name.substring(0, 22) + "..." : item.name;

                                return (
                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 6, backgroundColor: background }} key={idx} button onClick={() => this.handleOnClientClick(item)}>
                                        <Tooltip title={item.name} placement="top">
                                            <ListItemText>
                                                <p style={{ fontSize: 14, margin: 0 }}>{trimmedClient}</p>
                                            </ListItemText>
                                        </Tooltip>
                                        <ListItemSecondaryAction>
                                            {this.renderEdit(item)}
                                            {this.renderDelete(item, 'client')}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )
                }
            // } else if (show === "gKeyProject") {
            //     if (gProjects && gProjects.length > 0) {
            //         return (
            //             <List component="nav" id="list" style={{ padding: 0 }}>
            //                 {gProjects.map((item, idx) => {

            //                     let background = (selectedItem) ? (item._id === selectedItem._id) ? '#7d7c79' : "" : "";
            //                     let trimmedProject = (item.name.length > 17) ? item.name.substring(0, 17) + "..." : item.name;

            //                     return (
            //                         <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 6, backgroundColor: background }} key={idx} button onClick={() => this.handleOnProjectClick(item)}>
            //                             <Tooltip title={item.name} placement="top">
            //                                 <ListItemText>
            //                                     <p style={{ fontSize: 14, margin: 0 }}>{trimmedProject}</p>
            //                                 </ListItemText>
            //                             </Tooltip>
            //                             <ListItemSecondaryAction>
            //                                 <IconButton style={{ padding: 0, marginRight: 6 }} edge="end" id="view" onClick={() => this.props.handleProjectViewClick(item)}>
            //                                     <VisibilityIcon fontSize="small" />
            //                                 </IconButton>
            //                                 <IconButton style={{ marginRight: 6 }} edge="end" id="suit" onClick={() => this.props.handlePTestsuitClick(item)}>
            //                                     <WorkOutlineIcon fontSize="small" />
            //                                 </IconButton>
            //                                 {this.renderEdit(item)}
            //                                 {this.renderDelete(item, 'project')}
            //                             </ListItemSecondaryAction>
            //                         </ListItem>
            //                     )
            //                 })}
            //             </List>
            //         );
            //     }
            } else if (show === "gKeyTestcase") {
                return (
                    <TestcaseTree
                        gFolders={this.props.gFolders}
                        gTestcases={this.props.gTestcases}
                        gRefreshTree={this.props.gRefreshTree}
                        handleCopyTestcase={this.props.handleCopyTestcase}
                        handleFolderClick={this.props.handleFolderClick}
                        handleTestcaseClick={this.props.handleTestcaseClick}
                        handleCreateForm={this.props.handleCreateForm}
                        handleEditForm={this.props.handleEditForm}
                        handleDelete={this.props.handleDelete} />
                );
            } else if (show === "gKeyTestsuit") {
                if (gTestsuits && gTestsuits.length > 0) {
                    return (
                        <List component="nav" id="list" style={{ padding: 0 }}>
                            {gTestsuits.map((item, idx) => {

                                let background = (selectedItem) ? (item._id === selectedItem._id) ? '#7d7c79' : "" : "";
                                let trimmedTestsuit = (item.desc.length > 16) ? item.desc.substring(0, 16) + "..." : item.desc;

                                return (
                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 6, backgroundColor: background }} key={idx} button onClick={() => this.handleOnTestsuitClick(item)}>
                                        <Tooltip title={item.desc} placement="top">
                                            <ListItemText>
                                                <p style={{ fontSize: 14, margin: 0 }}>{trimmedTestsuit}</p>
                                            </ListItemText>
                                        </Tooltip>
                                        <ListItemSecondaryAction>
                                            {this.renderTestsuitStatus(item)}
                                            {this.renderEdit(item)}
                                            {this.renderDelete(item, 'testsuit')}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    );
                }
            } else if (show === "gAKeyClient") {
                if (gClients && gClients.length > 0) {
                    return (
                        <List component="nav" id="list" style={{ padding: 0 }}>
                            {gClients.map((item, idx) => {

                                let background = (selectedAItem) ? (item._id === selectedAItem._id) ? '#7d7c79' : "" : "";
                                let trimmedClient = (item.name.length > 22) ? item.name.substring(0, 22) + "..." : item.name;

                                return (
                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 6, backgroundColor: background }} key={idx} button onClick={() => this.handleOnAClientClick(item)}>
                                        <Tooltip title={item.name} placement="top">
                                            <ListItemText>
                                                <p style={{ fontSize: 14, margin: 0 }}>{trimmedClient}</p>
                                            </ListItemText>
                                        </Tooltip>
                                        <ListItemSecondaryAction>
                                            {this.renderEdit(item)}
                                            {this.renderDelete(item, 'client')}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )
                }
            } else if (show === "gKeyTicketProject") {
                if (gProjects && gProjects.length > 0) {
                    return (
                        <List component="nav" id="list" style={{ padding: 0 }}>
                            {gProjects.map((item, idx) => {

                                let background = (selectedItem) ? (item._id === selectedItem._id) ? '#7d7c79' : "" : "";
                                let trimmedProject = (item.name.length > 17) ? item.name.substring(0, 17) + "..." : item.name; return (

                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 6, backgroundColor: background }} key={idx} button onClick={() => this.handleOnTicketClick(item)}>
                                        <Tooltip title={item.name} placement="top">
                                            <ListItemText>
                                                <p style={{ fontSize: 14, margin: 0 }}>{trimmedProject}</p>
                                            </ListItemText>
                                        </Tooltip>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )
                }
            } else if (show === "gKeyWorkshop") {
                if (gWorkshops && gWorkshops.length > 0) {
                    return (
                        <List component="nav" id="list" style={{ padding: 0 }}>
                            {gWorkshops.map((item, idx) => {

                                let background = (selectedItem) ? (item.name === selectedItem.name) ? '#7d7c79' : "" : "";
                                let trimmedClient = (item.name.length > 22) ? item.name.substring(0, 22) + "..." : item.name;

                                return (
                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 6, backgroundColor: background }} key={idx} button onClick={() => this.handleOnWorkshopClick(item)}>
                                        <Tooltip title={item.name} placement="top">
                                            <ListItemText>
                                                <p style={{ fontSize: 14, margin: 0 }}>{trimmedClient}</p>
                                            </ListItemText>
                                        </Tooltip>
                                        <ListItemSecondaryAction>
                                            <IconButton style={{ padding: 0, marginRight: 5, color: '#2f4f4f' }} edge="end" id="restart" onClick={() => this.props.handleRefreshWorkshop(item)}>
                                                <Replay fontSize="small" />
                                            </IconButton>
                                            {this.renderPlatformIcon(item)}
                                            <IconButton style={{ padding: 0, color: '#a52a2a' }} edge="end" id="addnode" onClick={() => this.props.handleCreateForm("gKeyVMForm", "create")}>
                                                <ComputerIcon fontSize="small" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )
                }
            }
        } catch (e) {

        }

    }

    render() {
        Logger.debug("List>>>>>>", getTime());
        let { classes } = this.props;
        return (
            <div className={classes.card}>
                {this.renderListHead()}
                <div style={{ height: "87vh", overflow: "auto" }}>
                    {this.renderListBody()}
                </div>
            </div>
        );
    }

}

export default withRouter(connect(null, {})(withStyles(materialStyles)(ListComponent)));

