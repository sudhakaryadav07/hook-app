import * as type from './action';

const INITIAL = {
    _Id: 0,
    _mode: null,

    clients: [],
    client: {},

    projects: [],
    project: {},

    folders: [],
    folder: {},

    testcases: [],
    testcase: {},

    testsuits: [],
    testsuit: {},

    executions: [],
    execution: {},

    testlogs: [],
    testlog: {},

    allDataset: [],
    booleanDataset: [],

    loading: false,
    error: null,

    updateTree: false,
    swapTestcasePage: false,

    selectedTestcase: null
};

export default (state = INITIAL, action) => {
    switch (action.type) {

        //Client Reducer        
        case type.CLIENT_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                clients: action._model,
            };
        case type.CLIENT_CREATE_SUCCESS:
            return {
                ...state,
                clients: [
                    ...state.clients,
                    action._model.iModel
                ],
                client: action._model,
                _mode: "",
                loading: false
            };
        case type.CLIENT_UPDATE_INIT:
            return {
                ...state,
                _id: action._model._id,
                _mode: "UPDATE",
                loading: false,
                client: action._model,
            };
        case type.CLIENT_UPDATE_SUCCESS:
            return {
                ...state,
                clients: state
                    .clients
                    .map((client, index) => {
                        if (client._id !== action._model._id) {
                            return client;
                        }
                        return {
                            ...client,
                            ...action._model
                        }
                    }),
                client: action._model,
                _mode: "",
                loading: false
            };
        case type.CLIENT_DELETE_SUCCESS:
            return {
                ...state,
                clients: [...state.clients.filter((x, i) => x._id !== action._model._id)],
                client: {},
                _mode: "",
                loading: false
            };

        //Project Reducer
        case type.PROJECT_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                projects: action._model,
            };
        case type.PROJECT_CREATE_SUCCESS:

            return {
                ...state,
                projects: [
                    ...state.projects,
                    action._model
                ],
                project: action._model,
                _mode: "",
                loading: false
            };
        case type.PROJECT_UPDATE_INIT:
            return {
                ...state,
                _id: action._model._id,
                _mode: "UPDATE",
                loading: false,
                project: action._model,
            };
        case type.PROJECT_UPDATE_SUCCESS:
            return {
                ...state,
                projects: state
                    .projects
                    .map((project, index) => {
                        if (project._id !== action._model._id) {
                            return project;
                        }
                        return {
                            ...project,
                            ...action._model
                        }
                    }),
                project: action._model,
                _mode: "",
                loading: false
            };
        case type.PROJECT_DELETE_SUCCESS:
            return {
                ...state,
                projects: [...state.projects.filter((x, i) => x._id !== action._model._id)],
                project: {},
                _mode: "",
                loading: false
            };

        //Folder Reducer
        case type.FOLDER_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                folders: action._model,
                updateTree: false
            };
        case type.FOLDER_CREATE_SUCCESS:
            return {
                ...state,
                folders: [
                    ...state.folders,
                    action._model
                ],
                folder: action._model,
                _mode: "",
                loading: false,
                updateTree: true
            };
        case type.FOLDER_UPDATE_INIT:
            return {
                ...state,
                _id: action._model._id,
                _mode: "UPDATE",
                loading: false,
                folder: action._model,
                updateTree: false
            };

        case type.SET_SELECTED_TESTCASE:
            return {
                ...state,
                selectedTestcase: action.testcase,
                updateTree: false
            };

        case type.FOLDER_UPDATE_SUCCESS:
            return {
                ...state,
                folders: state
                    .folders
                    .map((folder, index) => {
                        if (folder._id !== action._model._id) {
                            return folder;
                        }
                        return {
                            ...folder,
                            ...action._model
                        }
                    }),
                folder: action._model,
                _mode: "",
                loading: false,
                updateTree: true
            };
        case type.FOLDER_DELETE_SUCCESS:
            return {
                ...state,
                folders: [...state.folders.filter((x, i) => x._id !== action._model._id)],
                folder: {},
                _mode: "",
                loading: false,
                updateTree: true
            };

        //Testcase Reducer
        case type.TESTCASE_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                testcases: action._model,
                updateTree: false
            };

        case type.TESTCASE_DETAILS_FETCH_SUCCESS:
            return {
                ...state,
                _id: action._model._id,
                testcase: action._model,
                updateTree: false
            }

        case type.TESTCASE_CREATE_SUCCESS:
            return {
                ...state,
                testcases: [
                    ...state.testcases,
                    action._model
                ],
                testcase: action._model,
                _mode: "",
                loading: false,
                updateTree: true
            };
        case type.TESTCASE_UPDATE_INIT:
            return {
                ...state,
                _id: action._model._id,
                _mode: "UPDATE",
                loading: false,
                testcase: action._model,
            };

        case type.TESTCASE_UPDATE_SUCCESS:
            return {
                ...state,
                testcases: state
                    .testcases
                    .map((testcase, index) => {
                        if (testcase._id !== action._model._id) {
                            return testcase;
                        }
                        return {
                            ...testcase,
                            ...action._model
                        }
                    }),
                testcase: action._model,
                _mode: "",
                loading: false,
                updateTree: true
            };

        case type.TESTCASE_DETAIL_UPDATE_SUCCESS:
            console.log(">>>>>>>>>>>>", action._model)
            return {
                ...state,
                testcases: state
                    .testcases
                    .map((testcase, index) => {
                        if (testcase._id !== action._model._id) {
                            return testcase;
                        }
                        return {
                            ...testcase,
                            ...action._model
                        }
                    }),
                testcase: action._model,
                _mode: "",
                loading: false,
                updateTree: false
            };

        case type.TESTCASE_DELETE_SUCCESS:
            return {
                ...state,
                testcases: [...state.testcases.filter((x, i) => x._id !== action._model._id)],
                testcase: {},
                _mode: "",
                loading: false,
                updateTree: true
            };

        case type.TESTCASE_SWIPE_INIT:
            return {
                ...state,
                swapTestcasePage: action._model.swipe,
                updateTree: false
            };

        //testsuits
        case type.TESTSUIT_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                testsuits: action._model,
            };

        case type.TESTSUIT_CREATE_SUCCESS:
            return {
                ...state,
                testsuits: [
                    ...state.testsuits,
                    action._model
                ],
                testsuit: action._model,
                _mode: "",
                loading: false
            };
        case type.TESTSUIT_UPDATE_INIT:
            return {
                ...state,
                _id: action._model._id,
                _mode: "UPDATE",
                loading: false,
                testsuit: action._model,
            };
        case type.TESTSUIT_UPDATE_SUCCESS:
            return {
                ...state,
                testsuits: state
                    .testsuits
                    .map((testsuit, index) => {
                        if (testsuit._id !== action._model._id) {
                            return testsuit;
                        }
                        return {
                            ...testsuit,
                            ...action._model
                        }
                    }),
                testsuit: action._model,
                _mode: "",
                loading: false
            };
        case type.TESTSUIT_DELETE_SUCCESS:
            return {
                ...state,
                testsuits: [...state.testsuits.filter((x, i) => x._id !== action._model._id)],
                testsuit: {},
                _mode: "",
                loading: false
            };

        //executions
        case type.EXECUTION_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                executions: action._model,
            };

        case type.EXECUTION_CREATE_SUCCESS:
            return {
                ...state,
                executions: [
                    ...state.executions,
                    action._model
                ],
                execution: action._model,
                _mode: "",
                loading: false
            };
        case type.EXECUTION_UPDATE_SUCCESS:
            return {
                ...state,
                executions: state
                    .executions
                    .map((execution, index) => {
                        if (execution._id !== action._model._id) {
                            return execution;
                        }
                        return {
                            ...execution,
                            ...action._model
                        }
                    }),
                execution: action._model,
                _mode: "",
                loading: false
            };



        case type.DATASET_MANAGER:
            return {
                ...state,
                allDataset: action._model.allDataset,
                booleanDataset: action._model.booleanDataset,
            };

        //Testlog
        case type.TESTLOG_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                _mode: "",
                testlogs: action._model,
            };

        case type.TREE_UPDATE_INIT:
            return {
                ...state,
                updateTree: false
            };

        default:
            return state;
    }
}