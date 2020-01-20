
import { TicketApi } from './api';
import { resCode } from '../../config/config';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const TICKET_FETCH_SUCCESS = 'TICKET_FETCH_SUCCESS';
export const TICKET_POST_SUCCESS = 'TICKET_POST_SUCCESS';
export const TICKET_UPDATE_INIT='TICKET_UPDATE_INIT';
export const TICKET_UPDATE_SUCCESS='TICKET_UPDATE_SUCCESS';
export const TICKET_DELETE_SUCCESS='TICKET_DELETE_SUCCESS';

const api = new TicketApi();

export const handleFetchTicketForProject = (_model) => async (dispatch) => {
    try {
        var response = await api.getTicket(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TICKET_FETCH_SUCCESS, _model: response.result });
            return response;
        }
    } catch (e) {
        console.log("Error", e.message);
    }
};


export const ticketUpdateRequest = (_model) => (dispatch) => {
    try {
        dispatch({ type: TICKET_UPDATE_INIT, _model });
    } catch (e) {
        console.log(" Error in initUpdateRequest ", e);
    }
}

export const ticketPost = (model) => async (dispatch) => {
    try {
        var response = await api.ticketPost(model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TICKET_POST_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const ticketPatch = (_id, _model) => async (dispatch) => {
    try {
        var response = await api.ticketPatch(_id, _model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TICKET_UPDATE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const destroyTicket = (_model) => async (dispatch) => {
    try {
        var response = await api.destroyTicket(_model);
        if (response && response.status === resCode.success) {
            dispatch({ type: TICKET_DELETE_SUCCESS, _model: response.result });
            return response;
        }
        return response;
    } catch (e) {
        console.log("Error", e.message)
    }
}
