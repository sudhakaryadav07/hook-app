import axios from 'axios';
import { apiKeys, resCode } from '../../config/config'

class RestApi {

    async getServerStatus(url) {
        try {
            const data = await axios.get(url);
            return data;
        } catch (error) {
            throw error;
        }
    }


    async login(url, args) {
        try {
            let body = { ...apiKeys, ...args, method: resCode.post };
            let header = await this.getHeaderToken(body);
            const data = await axios.post(url, body, header);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async get(url, args) {
        try {
            let body = { ...args, ...apiKeys, method: resCode.post };
            let header = await this.getHeaderAdv();
            const data = await axios.post(url, body, header);
            return data;
        } catch (error) {
            throw error
        }
    }

    async post(url, args) {
        try {
            let body = { ...args, ...apiKeys, method: resCode.post };
            let header = await this.getHeaderAdv();
            const data = await axios.post(url, body, header);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async patch(url, args) {
        try {
            let body = { ...args, ...apiKeys, method: resCode.patch };
            let header = await this.getHeaderAdv();
            const data = await axios.patch(url, body, header);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async destroy(url, args) {
        try {
            // let body = { ...args, ...apiKeys, method: resCode.delete };
            let header = await this.getHeaderAdv();
            const data = await axios.delete(url,header);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async upload(url, args) {
        try {
            let header = await this.getHeaderMulti();
            const data = await axios.post(url, args,header);
            return data;
        } catch (error) {
            throw error;
        }
    }


    async getHeaderToken() {
        let username = await localStorage.getItem("username");
        let token = await localStorage.getItem("token");
        return {
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'username': username
            }
        };
    }

    async getHeaderAdv() {
        let _token = await localStorage.getItem("token");
        let username = await localStorage.getItem("username");
        let password = await localStorage.getItem("password");
        return {
            headers: {
                'Content-Type': 'application/json',
                'token': _token,
                'username': username,
                'password': password,
            }
        };
    }


    async getHeaderMulti() {
        let _token = await localStorage.getItem("token");
        let username = await localStorage.getItem("username");
        let password = await localStorage.getItem("password");
        return {
            headers: {
                'Content-Type': 'multipart/form-data',
                'enctype': 'multipart/form-data',
                'token': _token,
                'username': username,
                'password': password,
            }
        };
    }

}

export default RestApi;