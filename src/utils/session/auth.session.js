export default class AuthSession {

    async set(iModel) {
        try {
            if (iModel) {
                let { username, password, token,role } = iModel;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                localStorage.setItem('role', role);
            }
        } catch (error) {
            throw error;
        }
    }

    async get(args) {
        try {
            return localStorage.getItem(args);
        } catch (error) {
            throw error;
        }
    }

    async clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            throw error
        }
    }


}



