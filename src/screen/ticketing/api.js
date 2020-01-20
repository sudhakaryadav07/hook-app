
import { servergroup } from '../../config/config';
import { RestApi } from '../../utils';
const restApi = new RestApi();

class TicketApi {

    async getTicket(args) {
        try {
            const path = servergroup.api + `/api/ticket/project`;
            const { data } = await restApi.post(path,args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async ticketPost(args) {
        try {
            const path = servergroup.api + `/api/ticket/insert`;
            const { data } = await restApi.post(path, args);
            return data;
        } catch (error) {
            throw error
        }
    }

    async ticketPatch(_id, args) {
        try {
            const path = servergroup.api + `/api/ticket/update/${_id}`;
            const { data } = await restApi.patch(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }
  
    async destroyTicket(args) {
        try {
            const path = servergroup.api + `/api/ticket/delete/${args._id}`;
            const { data } = await restApi.destroy(path, args);
            return data;
        } catch (error) {
            throw error;
        }
    }

}

export { TicketApi };
