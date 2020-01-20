
import { servergroup } from '../../config/config';
import { RestApi } from '../../utils';
const restApi = new RestApi();

class ProjectApi {

    //Client Api
    async getClientByName(args) {
        try {
            const path = servergroup.api + `/api/client/getByName`;
            const { data } = await restApi.get(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async getClient() {
        try {
            const path = servergroup.api + `/api/client/all`;
            const { data } = await restApi.get(path);
            return data;
        } catch (error) {
            throw error
        }
    }

    async clientPost(args) {
        try {
            const path = servergroup.api + `/api/client/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async clientPatch(_id, args) {
        try {
            const path = servergroup.api + `/api/client/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async clientDestroy(args) {
        try {
            const path = servergroup.api + `/api/client/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    //Project Api
    async getProject(args) {
        try {
            const path = servergroup.api + `/api/project/allByName`;
            const { data } = await restApi.get(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async getProjectDetails(args) {
        try {
            const path = servergroup.api + `/api/project/details`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async projectPost(args) {
        try {
            const path = servergroup.api + `/api/project/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async projectAddDataset(args) {
        try {
            const path = servergroup.api + `/api/project/add/dataset`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async projectPatch(_id, args) {
        try {
            const path = servergroup.api + `/api/project/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async projectDetailsPatch(model, args) {
        try {
            let { _id, baseUrl, buildNo } = model;
            const path = servergroup.api + `/api/project/projectdetails/${_id}/${baseUrl}/${buildNo}`;
            const { data } = await restApi.upload(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async projectDatasetPatch(args) {
        try {
            const path = servergroup.api + `/api/project/update/dataset`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async projectDestroy(args) {
        try {
            const path = servergroup.api + `/api/project/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async projectDatasetDestroy(args) {
        try {
            const path = servergroup.api + `/api/project/delete/dataset`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    //Folder Api
    async getFolder(args) {
        try {
            const path = servergroup.api + `/api/folder/allByProjectId`;
            const { data } = await restApi.get(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async postFolder(args) {
        try {
            const path = servergroup.api + `/api/folder/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async patchFolder(_id, args) {
        try {
            const path = servergroup.api + `/api/folder/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async destroyFolder(args) {
        try {
            const path = servergroup.api + `/api/folder/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    //Testcase Api
    async getTestcase(args) {
        try {
            const path = servergroup.api + `/api/testcase/descForAllByProjectId`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getTestcaseDetails(args) {
        try {
            const path = servergroup.api + `/api/testcase/byId`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getCloneTestcaseDetails(args) {
        try {
            const path = servergroup.api + `/api/testcase/cloneof`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcasePost(args) {
        try {
            const path = servergroup.api + `/api/testcase/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcasePatch(_id, args) {
        try {
            const path = servergroup.api + `/api/testcase/update/desc/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseAddStep(args) {
        try {
            const path = servergroup.api + `/api/testcase/add/step`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseAddBulkStep(args) {
        try {
            const path = servergroup.api + `/api/testcase/add/bulkstep`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseAddDataset(args) {
        try {
            const path = servergroup.api + `/api/testcase/add/dataset`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async copyTestcase(args) {
        try {
            const path = servergroup.api + `/api/testcase/add/copytestcase`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseStepPatch(args) {
        try {
            const path = servergroup.api + `/api/testcase/update/step`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseDatasetPatch(args) {
        try {
            const path = servergroup.api + `/api/testcase/update/dataset`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }


    async testcaseSequencePatch(_id, args) {
        try {
            const path = servergroup.api + `/api/testcase/update/sequence/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseDestroy(args) {
        try {
            const path = servergroup.api + `/api/testcase/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseStepDestroy(args) {
        try {
            const path = servergroup.api + `/api/testcase/delete/step`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testcaseDatasetDestroy(args) {
        try {
            const path = servergroup.api + `/api/testcase/delete/dataset`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getCsvDetails(args) {
        try {
            const path = servergroup.api + `/api/testcase/csvdetail`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }


    async handleUploadCSV(args) {
        try {
            const path = servergroup.api + `/api/testcase/importbycsv/${args.client}/${args.project}`;
            const { data } = await restApi.upload(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async postCsvDetails(args) {
        try {
            const path = servergroup.api + `/api/testcase/bulktestcase`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    //Testsuit
    async getTestsuit(args) {
        try {
            const path = servergroup.api + `/api/testsuit/descForAllByProjectId`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testsuitPost(args) {
        try {
            const path = servergroup.api + `/api/testsuit/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testsuitPatch(_id, args) {
        try {
            const path = servergroup.api + `/api/testsuit/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async testsuitDestroy(args) {
        try {
            const path = servergroup.api + `/api/testsuit/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    //Execution Api
    async getExecution(args) {
        try {
            const path = servergroup.api + `/api/execution/all`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getExecutionList(args) {
        try {
            const path = servergroup.api + `/api/execution/byExecutionId`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async postExecution(args) {
        try {
            const path = servergroup.api + `/api/execution/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async patchExecution(args) {
        try {
            const path = servergroup.api + `/api/execution/update`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    //Dataset Api
    async getDataset(args) {
        try {
            const path = servergroup.api + `/api/testcase/dataset`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    // TestlogsApi
    async getTestlogs(args) {
        try {
            const path = servergroup.api + `/api/testlog/suite`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getImageForSteps(args) {
        try {
            const path = servergroup.api + `/api/testlog/image`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getStepsForTestsuit(args) {
        try {
            const path = servergroup.api + `/api/testlog/step`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

}

export { ProjectApi };


