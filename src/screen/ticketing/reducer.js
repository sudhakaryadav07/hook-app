import * as type from './action';

const INITIAL = {
    tickets: [],
    ticket: {}
};

export default (state = INITIAL, action) => {
    switch (action.type) {

        case type.TICKET_FETCH_SUCCESS:
            return {
                ...state,
                tickets: action._model,
            };

        case type.TICKET_POST_SUCCESS:
            return {
                ...state,
                tickets: [
                    ...state.tickets,
                    action._model.iModel
                ],
                ticket: action._model,
            };

        case type.TICKET_UPDATE_INIT:
            return {
                ...state,
                ticket: action._model,
            };

        case type.TICKET_UPDATE_SUCCESS:
            return {
                ...state,
                tickets: state
                    .tickets
                    .map((ticket, index) => {
                        if (ticket._id !== action._model._id) {
                            return ticket;
                        }
                        return {
                            ...ticket,
                            ...action._model
                        }
                    }),
                ticket: action._model,
            };

        case type.TICKET_DELETE_SUCCESS:
            return {
                ...state,
                tickets: [...state.tickets.filter((x, i) => x._id !== action._model._id)],
                ticket: {},
            };

        default:
            return state;
    }
}