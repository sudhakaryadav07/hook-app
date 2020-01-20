
import { LoginApi } from './api';
import { resCode } from '../../config/config';
import { AuthSession } from '../../utils/session/index';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

const api = new LoginApi();
const session = new AuthSession();

export const login = (model) => async (dispatch) => {
    try {
        var response = await api.login(model);
        if (response && response.status === resCode.success) {
            await session.set(response.result);
            let model = response.result;
            dispatch(LOGIN_SUCCESS, model);
            return response;
        }
        return response;
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export const logout = () => async (dispatch) => {
    try {
        await localStorage.clear();
    } catch (e) {
        console.log(" Error  ", e.message);
    }
}

export { LOGIN_SUCCESS };
