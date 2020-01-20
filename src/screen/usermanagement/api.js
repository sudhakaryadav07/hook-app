
import { servergroup } from '../../config/config';
import { RestApi } from '../../utils';
const restApi = new RestApi();

class LoginApi {

    async getServerStatus() {
        try {
            const path = servergroup.api + `/api/status`;
            const { data } = await restApi.getServerStatus(path);
            return data;
        } catch (error) {
            throw error
        }
    }

    async login(args) {
        try {
            const path = servergroup.api + `/api/authuser/login`;
            const { data } = await restApi.login(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async getUsers(args) {
        try {
            const path = servergroup.api + `/api/user/client`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async postUser(args) {
        try {
            const path = servergroup.api + `/api/user/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async patchUser(_id, args) {
        try {
            const path = servergroup.api + `/api/user/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async patchPassword(args) {
        try {
            const path = servergroup.api + `/api/user/update/password/${args._id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async destroyUser(args) {
        try {
            const path = servergroup.api + `/api/user/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getWorkshop(args) {
        try {
            const path = servergroup.api + `/api/workshop/all`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async getWorkshopByName(args) {
        try {
            const path = servergroup.api + `/api/workshop/getByName`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async postWorkshop(args) {
        try {
            const path = servergroup.api + `/api/workshop/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async handleStartWorkshop(args) {
        try {
            const path = servergroup.api + `/api/workshop/start`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async handleCheckStatus(args) {
        try {
            const path = servergroup.api + `/api/workshop/refresh`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async postVm(args) {
        try {
            const path = servergroup.api + `/api/workshop/vm/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async patchWorkshop(_id, args) {
        try {
            const path = servergroup.api + `/api/workshop/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async destroyWorkshop(args) {
        try {
            const path = servergroup.api + `/api/workshop/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async destroyNode(args) {
        try {
            const path = servergroup.api + `/api/workshop/node/delete/${args._id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

}

export { LoginApi };
