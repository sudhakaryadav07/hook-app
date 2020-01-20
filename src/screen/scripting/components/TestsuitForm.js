import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import {
    List, ListItem, ListItemText, Paper, Grid, MenuItem, TextField, InputBase, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography
} from '@material-ui/core';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';

import { testsuitPost, testsuitPatch } from '../action';
import { TestsuitReactGrid } from './index';
import { resCode } from '../../../config/config';

import { validateTestsuit } from '../validate';
import { getTime } from '../../../utils/helper';
import { modal } from '../../../style/app';

const materialStyles = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    paper1: {
        height: "15%",
        textAlign: 'center',
        marginBottom: 5,
        backgroundColor: '#dee2e6',
        color: theme.palette.text.secondary,
    },

    paper2: {
        height: "53vh",
        overflow: "auto",
        textAlign: 'center',
        backgroundColor: '#dee2e6',
        color: theme.palette.text.secondary,
    },

    paper3: {
        textAlign: 'center',
        padding: 0,
        marginBottom: 5,
        color: theme.palette.text.secondary,
    },

    paper4: {
        height: "57vh",
        overflow: "auto",
        textAlign: 'center',
        backgroundColor: '#dee2e6',
        color: theme.palette.text.secondary,
    },

    search: {
        position: 'relative',
        backgroundColor: 'lightgrey',
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            padding: 0,
            width: 'auto',
            margin: 0
        },
    },
    searchIcon: {
        width: theme.spacing(5),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'black',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        color: 'black',
    },
    textField: {
        margin: 0,
    },
    closebutton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: 9,
        color: 'grey'
    },
});

Logger.useDefaults();

class TestsuitForm extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            title: "",
            MODE: "",

            gTestcases: this.props.gTestcases,

            client: "",
            project: "",
            desc: "",
            platform: "",
            createdBy: "",
            updatedBy: "",
            testcase: [],

            errors: {},
            gKeyTestsuit: "gKeyTestsuit" + Math.random()
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
            console.log(e)
        }
    }

    initState = () => {
        try {
            let { MODE, aStore } = this.props;
            let { userId } = aStore;
            let { _id, client } = this.props.gStore.project;
            let title = "";
            if (MODE === "create") {
                title = "Create Testsuit";
                this.setState({ title, MODE, client: client, project: _id, createdBy: userId, updatedBy: null });
            } else {
                title = "Edit Testsuit";
                let { _id, client, desc, project, platform, testcase, createdBy } = this.props.gStore.testsuit;
                this.setState({ title, MODE, _id, client, project, desc, platform, testcase, createdBy, updatedBy: userId });
            }
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleChange = (event) => {
        try {
            const _state = this.state;
            _state[event.target.name] = event.target.value;
            this.setState({ state: _state });
        } catch (e) {
            Logger.debug(e);
        }
    }

    testsuitSeq = async (data) => {
        try {
            let testcase = await data.map((item, i) => { return { id: data[i].id, testcaseId: data[i].testcaseId, testcaseName: data[i].testcaseName, skip: data[i].skip, seq: data[i].seq } });
            this.setState({ testcase })
        } catch (e) {

        }
    };

    handleDelete = async (data) => {
        let { testcase } = this.state;
        testcase = testcase.filter(item => item.seq !== data.seq);
        this.setState({ testcase });
    };

    addTestuitHelper = async (testcase, data, seq) => {
        try {
            testcase = [...testcase, { folderId: data.folder, folderName: data.folderName, testcaseId: data._id, testcaseName: data.desc, skip: false, seq: seq }];
            this.setState({ testcase });
        } catch (e) {

        }
    }

    handleAddToTestsuit = async (data) => {
        try {
            let { testcase } = this.state;
            let seq = testcase.length + 1;
            let insert = null;

            for (let test of testcase) {
                if (test.testcaseName === data.testcaseName) {
                    insert = false;
                    return;
                } else {
                    insert = true;
                }
            }

            if (testcase.length === 0) {
                this.addTestuitHelper(testcase, data, seq);
                return;
            }

            if (insert === true) {
                this.addTestuitHelper(testcase, data, seq);
                return;
            }

        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSearchTestcase = (e) => {
        try {
            let { gTestcases } = this.props;
            let tfilterInput = e.target.value;
            this.setState({ filterInput: tfilterInput });

            if (!tfilterInput) {
                this.setState({ gTestcases: gTestcases });
                return true;
            }

            tfilterInput = tfilterInput.toLowerCase();
            let filteredTestcases = gTestcases.filter((data) => {
                let { desc } = data;
                desc = (desc) ? desc.toLowerCase() : ""
                return (
                    desc.indexOf(tfilterInput) >= 0
                );
            })
            this.setState({ gTestcases: filteredTestcases });
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSubmit = async () => {
        try {
            let { client, project, desc, platform, testcase, createdBy, updatedBy } = this.state;
            let validDesc = desc.trim();
            let _model = { client, project, desc: validDesc, platform, testcase, createdBy, updatedBy };
            this.handleSave(_model);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleSave = async (_model) => {
        try {
            let status = validateTestsuit(_model);
            if (status !== undefined && status.errorFound === false) {
                let { _id, MODE } = this.state;

                let response, testsuitSuccess, testsuitError = "";
                if (MODE === "create") {
                    response = await this.props.testsuitPost(_model);
                    testsuitSuccess = "Testsuit Created !";
                    testsuitError = "Testsuit Already Created !";
                } else {
                    response = await this.props.testsuitPatch(_id, _model);

                    testsuitSuccess = "Testsuit Edited !";
                    testsuitError = "Testsuit Already Created !";
                }

                let { status } = response;
                if (status === resCode.success) {
                    this.props.handleUpdateStatus(status, testsuitSuccess);
                } else if (status === resCode.error) {
                    this.props.handleUpdateStatus(status, testsuitError);
                }
                this.props.resetComponent("gKeyTestsuitForm");
                return;
            } else {
                this.handleErrors(status.errors);
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleErrors = (errors) => this.setState({ errors });

    handleClose = () => this.props.resetComponent("gKeyTestsuitForm");

    renderTestcaseTable() {
        let { testcase } = this.state;
        if (testcase && testcase.length > 0) {
            return (
                <TestsuitReactGrid
                    testcase={testcase}
                    handleStepEdit={this.handleStepEdit}
                    handleDelete={this.handleDelete}
                    testsuitSeq={this.testsuitSeq}
                />
            );
        }
    }

    renderTestcasesList() {
        let { gTestcases } = this.state;
        if (gTestcases && gTestcases.length > 0) {
            return (
                <List >
                    {gTestcases.map((test, i) => {
                        let { folderName, desc } = test;
                        return (
                            <ListItem key={i} dense button onClick={() => this.handleAddToTestsuit(test)}>
                                <ListItemText primary={folderName + " -- " + desc} />
                            </ListItem>
                        );
                    })}
                </List>
            );
        }
    }

    renderTable() {
        let time = getTime();
        Logger.debug("TestsuitForm>>>>>>", time);
        let { classes } = this.props;
        let { title, errors, desc, platform } = this.state;
        return (
            <Dialog maxWidth="md" fullWidth={true} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" style={modal.header}>
                    <Typography style={modal.headerTitle}>{title}</Typography>
                    <IconButton aria-label="close" className={classes.closebutton} onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers style={modal.content}>
                    <Grid container spacing={3} >
                        <Grid item xs={6} style={{ paddingTop: 5, paddingLeft: 0, paddingBottom: 0 }}>
                            <Paper className={classes.paper1}>
                                <Grid container spacing={3} style={{ width: "100%", margin: 0 }}>
                                    <Grid item xs={6} style={{ paddingTop: 5, paddingBottom: 0 }}>
                                        <TextField
                                            id="desc"
                                            label="Description"
                                            name="desc"
                                            fullWidth
                                            type="input"
                                            margin="normal"
                                            value={desc}
                                            onChange={this.handleChange}
                                            error={errors.desc}
                                            autoFocus={true}
                                        />
                                    </Grid>
                                    <Grid item xs={6} style={{ paddingTop: 5, paddingLeft: 0, paddingBottom: 0 }}>
                                        <TextField
                                            id="selectplatform"
                                            name="platform"
                                            fullWidth
                                            select
                                            label="Platform"
                                            value={platform}
                                            onChange={this.handleChange}
                                            SelectProps={{
                                                MenuProps: {
                                                    className: classes.menu,
                                                },
                                            }}
                                            margin="normal"
                                            error={errors.platform}
                                        >
                                            {[{ key: "1", label: "Chrome", value: "chrome" }
                                                , { key: "2", label: "Firefox", value: "firefox" }
                                                , { key: "3", label: "IE", value: "ie" }].map(option => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <Paper className={classes.paper2}>
                                {this.renderTestcaseTable()}
                            </Paper>
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                            <Paper className={classes.paper3}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon />
                                    </div>
                                    <InputBase
                                        placeholder="Search Testcase..."
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={this.handleSearchTestcase}
                                    />
                                </div>
                            </Paper>
                            <Paper className={classes.paper4}>
                                {this.renderTestcasesList()}
                            </Paper>
                        </Grid>
                    </Grid >
                </DialogContent>
                <DialogActions className={classes.action} style={modal.action}>
                    <Button onClick={this.handleSubmit} color="primary"> Save </Button>
                </DialogActions>
            </Dialog >
        );
    }

    render() {
        return (
            <div>
                {this.renderTable()}
            </div>
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    return { aStore, gStore };
}

export default withRouter(connect(mapStateToProps, { testsuitPost, testsuitPatch })(withStyles(materialStyles)(TestsuitForm)));


