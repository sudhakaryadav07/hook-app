
import { ProjectApi } from './api';
import { resCode } from '../../config/config';

export const CLIENT_FETCH_SUCCESS = 'CLIENT_FETCH_SUCCESS';
export const CLIENT_CREATE_SUCCESS = 'CLIENT_CREATE_SUCCESS';
export const CLIENT_UPDATE_INIT = 'CLIENT_UPDATE_INIT';
export const CLIENT_UPDATE_SUCCESS = 'CLIENT_UPDATE_SUCCESS';
export const CLIENT_DELETE_SUCCESS = 'CLIENT_DELETE_SUCCESS';

export const PROJECT_FETCH_SUCCESS = 'PROJECT_FETCH_SUCCESS';
export const PROJECT_CREATE_SUCCESS = 'PROJECT_CREATE_SUCCESS';
export const PROJECT_UPDATE_INIT = 'PROJECT_UPDATE_INIT';
export const PROJECT_UPDATE_SUCCESS = 'PROJECT_UPDATE_SUCCESS';
export const PROJECT_DELETE_SUCCESS = 'PROJECT_DELETE_SUCCESS';

export const FOLDER_FETCH_SUCCESS = 'FOLDER_FETCH_SUCCESS';
export const FOLDER_CREATE_SUCCESS = 'FOLDER_CREATE_SUCCESS';
export const FOLDER_UPDATE_INIT = 'FOLDER_UPDATE_INIT';
export const FOLDER_UPDATE_SUCCESS = 'FOLDER_UPDATE_SUCCESS';
export const FOLDER_DELETE_SUCCESS = 'FOLDER_DELETE_SUCCESS';

export const TESTCASE_FETCH_SUCCESS = 'TESTCASE_FETCH_SUCCESS';
export const TESTCASE_CREATE_SUCCESS = 'TESTCASE_CREATE_SUCCESS';
export const TESTCASE_DETAIL_UPDATE_SUCCESS = 'TESTCASE_DETAIL_UPDATE_SUCCESS';
export const TESTCASE_UPDATE_INIT = 'TESTCASE_UPDATE_INIT';
export const SET_SELECTED_TESTCASE='SET_SELECTED_TESTCASE';
export const TESTCASE_UPDATE_SUCCESS = 'TESTCASE_UPDATE_SUCCESS';
export const TESTCASE_DELETE_SUCCESS = 'TESTCASE_DELETE_SUCCESS';

export const TESTCASE_DETAILS_FETCH_SUCCESS = 'TESTCASE_DETAILS_FETCH_SUCCESS';
export const PROJECT_STEP_UPDATE_SUCCESS = 'PROJECT_STEP_UPDATE_SUCCESS';

export const TESTSUIT_FETCH_SUCCESS = 'TESTSUIT_FETCH_SUCCESS';
export const TESTSUIT_CREATE_SUCCESS = 'TESTSUIT_CREATE_SUCCESS';
export const TESTSUIT_UPDATE_INIT = 'TESTSUIT_UPDATE_INIT';
export const TESTSUIT_UPDATE_SUCCESS = 'TESTSUIT_UPDATE_SUCCESS';
export const TESTSUIT_DELETE_SUCCESS = 'TESTSUIT_DELETE_SUCCESS';

export const EXECUTION_FETCH_SUCCESS = 'EXECUTION_FETCH_SUCCESS';
export const EXECUTION_CREATE_SUCCESS = 'EXECUTION_CREATE_SUCCESS';
export const EXECUTION_UPDATE_SUCCESS = 'EXECUTION_UPDATE_SUCCESS';

export const TESTLOG_FETCH_SUCCESS = 'TESTLOG_FETCH_SUCCESS';

export const DATASET_MANAGER = 'DATASET_MANAGER';

export const TREE_UPDATE_INIT = 'TREE_UPDATE_INIT';

export const TESTCASE_SWIPE_INIT = 'TESTCASE_SWIPE_INIT';

const api = new ProjectApi();

const stepPatcher = (response, dispatch) => {
    if (response && response.status === resCode.success) {
        dispatch({ type: TESTCASE_UPDATE_SUCCESS, _model: response.result });
        return response;
    }
    return response;
}

//Client Action
export const getClientByName = (model) => async (dispatch) => {
    try {
        var response = await api.getClientByName(model);
        if (response && response.status === resCode.success) {
            dispatch({ type: CLIENT_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const getClient = () => async (dispatch) => {
    try {
        var response = await api.getClient();
        if (response && response.status === resCode.success) {
            dispatch({ type: CLIENT_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const clientPost = (_model) => async (dispatch) => {
    try {
        var response = await api.clientPost(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: CLIENT_CREATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);;
    }
}

export const clientUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: CLIENT_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const clientPatch = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.clientPatch(_id, _model);
        if (response && response.status === resCode.success) {
            dispatch({ type: CLIENT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const clientDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.clientDestroy(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: CLIENT_DELETE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log("Error", e.message)
    }
}

//Project Action
export const getProject = (_model) => async (dispatch) => {
    try {
        var response = await api.getProject(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const getProjectDetails = (_model) => async (dispatch) => {
    try {
        var response = await api.getProjectDetails(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};


export const projectPost = (_model) => async (dispatch) => {
    try {
        var response = await api.projectPost(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_CREATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);;
    }
}

export const projectAddDataset = (_model) => async (dispatch) => {
    try {
        var response = await api.projectAddDataset(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const projectUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: PROJECT_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const projectPatch = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.projectPatch(_id, _model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const projectDetailsPatch = (model, _model) => async (dispatch) => {
    try {
        var response = await api.projectDetailsPatch(model, _model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const projectDatasetPatch = (_model) => async (dispatch) => {
    try {
        var response = await api.projectDatasetPatch(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const projectDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.projectDestroy(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_DELETE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log("Error", e.message)
    }
}


export const projectDatasetDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.projectDatasetDestroy(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: PROJECT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

//Folder Action 
export const getFolder = (_model) => async (dispatch) => {
    try {
        var response = await api.getFolder(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: FOLDER_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const postFolder = (_model) => async (dispatch) => {
    try {
        var response = await api.postFolder(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: FOLDER_CREATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);;
    }
}

export const folderUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: FOLDER_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const patchFolder = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.patchFolder(_id, _model);
        if (response && response.status === resCode.success) {
            dispatch({ type: FOLDER_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const folderDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.destroyFolder(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: FOLDER_DELETE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log("Error", e.message)
    }
}

//Testcase Action
export const getTestcase = (_model) => async (dispatch) => {
    try {
        var response = await api.getTestcase(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const getTestcaseDetails = (_model) => async (dispatch) => {
    try {
        var response = await api.getTestcaseDetails(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DETAILS_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const getCloneTestcaseDetails = (_model) => async (dispatch) => {
    try {
        var response = await api.getCloneTestcaseDetails(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DETAILS_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const testcasePost = (_model) => async (dispatch) => {
    try {
        var response = await api.testcasePost(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_CREATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);;
    }
}

export const testcaseUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TESTCASE_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const testcaseStepUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TESTCASE_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const testcaseDatasetUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TESTCASE_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const setTestcase = (testcase) => (dispatch) => {
    try {
        dispatch({ type: SET_SELECTED_TESTCASE, testcase });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const testcaseAddStep = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseAddStep(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DETAIL_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseAddBulkStep = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseAddBulkStep(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DETAIL_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseAddDataset = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseAddDataset(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DETAIL_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const getTestcaseSteps = (_model) => async (dispatch) => {
    try {
        var response = await api.getTestcaseDetails(_model);
        if (response && response.status === resCode.success) {
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const copyTestcase = (_model) => async (dispatch) => {
    try {
        var response = await api.copyTestcase(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DETAIL_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcasePatch = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.testcasePatch(_id, _model);
        return stepPatcher(response, dispatch);
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseStepPatch = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseStepPatch(_model);
        return stepPatcher(response, dispatch);
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseDatasetPatch = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseDatasetPatch(_model);
        return stepPatcher(response, dispatch);
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseSequencePatch = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.testcaseSequencePatch(_id, _model);
        return stepPatcher(response, dispatch);
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseDestroy(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTCASE_DELETE_SUCCESS, _model: response.result });
        }
        return response;
    } catch (e) {
        console.log("Error", e.message)
    }
}

export const testcaseStepDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseStepDestroy(_model);
        return stepPatcher(response, dispatch);
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseDatasetDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.testcaseDatasetDestroy(_model);
        return stepPatcher(response, dispatch);
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testcaseSwipeRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TESTCASE_SWIPE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const getCsvDetails = (_model) => async (dispatch) => {
    try {
        var response = await api.getCsvDetails(_model);
        return response;
    } catch (e) {
        console.log(e);
    }
}

export const postCsvDetails = (_model) => async (dispatch) => {
    try {
        var response = await api.postCsvDetails(_model);
        return response;
    } catch (e) {
        console.log(e);
    }
}

//Testsuit actions
export const getTestsuit = (_model) => async (dispatch) => {
    try {
        var response = await api.getTestsuit(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTSUIT_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const testsuitPost = (_model) => async (dispatch) => {
    try {
        var response = await api.testsuitPost(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTSUIT_CREATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testsuitUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TESTSUIT_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const testsuitPatch = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.testsuitPatch(_id, _model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTSUIT_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const testsuitDestroy = (_model) => async (dispatch) => {
    try {
        var response = await api.testsuitDestroy(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTSUIT_DELETE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log("Error", e.message)
    }
}

//Execution Api
export const getExecution = (_model) => async (dispatch) => {
    try {
        var response = await api.getExecution(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: EXECUTION_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const getExecutionList = (_model) => async (dispatch) => {
    try {
        var response = await api.getExecutionList(_model);
        if (response && response.status === resCode.success) {
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};

export const postExecution = (_model) => async (dispatch) => {
    try {
        var response = await api.postExecution(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: EXECUTION_CREATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const patchExecution = (_model) => async (dispatch) => {
    try {
        var response = await api.patchExecution(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: EXECUTION_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const getDataset = (model) => async (dispatch) => {
    try {
        var response = await api.getDataset(model);
        if (response && response.status === resCode.success) {
            dispatch({ type: DATASET_MANAGER, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}



//Testlogs Action
export const getTestlogs = (model) => async (dispatch) => {
    try {
        var response = await api.getTestlogs(model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TESTLOG_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const getImageForSteps = (model) => async (dispatch) => {
    try {
        var response = await api.getImageForSteps(model);
        if (response && response.status === resCode.success) {
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const getStepsForTestsuit = (model) => async (dispatch) => {
    try {
        var response = await api.getStepsForTestsuit(model);
        if (response && response.status === resCode.success) {
            return response;
        }
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const treeUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TREE_UPDATE_INIT });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

