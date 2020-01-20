import * as type from './action';

const INITIAL = {
    username: null,
    password: null,
    token: null,
    userId: null,
    role: null,
};

export default (state = INITIAL, action) => {
    switch (action.type) {

        case type.LOGIN_SUCCESS:
            return {
                ...state,
                username: action._model.username,
                password: action._model.password,
                token: action._model.token,
                role: action._model.role,
                userId: action._model._id,
            };

        default:
            return state;
    }
}