import { initStore } from './store';
import { LOGIN_SUCCESS } from '../screen/usermanagement/action';

const configureStore = () => {
    const actions = {
        LOGIN_SUCCESS: (state, model) => {
            return {
                ...state,
                username: model.username,
                password: model.password,
                token: model.token,
                role: model.role,
                userId: model._id,
            };
        }
    };
    initStore(actions, {
        username: null,
        password: null,
        token: null,
        userId: null,
        role: null,
    });
};

export default configureStore;