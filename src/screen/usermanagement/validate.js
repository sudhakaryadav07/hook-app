export const validatePassword = (_model) => {

    const {password } = _model

    let _errors = {};
    let error_found = false;

    if (!password.trim()) {
        _errors.password = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

export const loginValidate = (_model) => {

    const { username, password } = _model

    let _errors = {};
    let error_found = false;

    if (!username.trim()) {
        _errors.username = true;
        error_found = true;
    }

    if (!password.trim()) {
        _errors.password = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

export const registrationValidate = (_model) => {

    const { username, password, name, role } = _model

    let _errors = {};
    let error_found = false;

    if (!username.trim()) {
        _errors.username = true;
        error_found = true;
    }

    if (!username.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        _errors.username = true;
        error_found = true;
    }

    if (!password.trim()) {
        _errors.password = true;
        error_found = true;
    }

    if (!name.trim()) {
        _errors.name = true;
        error_found = true;
    }

    if (!role) {
        _errors.role = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

export const workshopValidate = (_model) => {

    const { name, platform } = _model

    let _errors = {};
    let error_found = false;

    if (!name.trim()) {
        _errors.name = true;
        error_found = true;
    }

    if (!platform) {
        _errors.platform = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

export const vmClient = (_model) => {

    const { type, ip, username } = _model

    let _errors = {};
    let error_found = false;

    if (!type) {
        _errors.type = true;
        error_found = true;
    }

    if (!ip.trim()) {
        _errors.ip = true;
        error_found = true;
    }

    if (!username.trim()) {
        _errors.username = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

export const vmHub = (_model) => {

    const { type, ip, username, port } = _model

    let _errors = {};
    let error_found = false;

    if (!type) {
        _errors.type = true;
        error_found = true;
    }

    if (!ip.trim()) {
        _errors.ip = true;
        error_found = true;
    }

    if (!username.trim()) {
        _errors.username = true;
        error_found = true;
    }
    if (!port.trim()) {
        _errors.port = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

export const vmNode = (_model) => {

    const { type, ip, username, port, maxInstance, maxSession } = _model

    let _errors = {};
    let error_found = false;

    if (!type) {
        _errors.type = true;
        error_found = true;
    }

    if (!ip.trim()) {
        _errors.ip = true;
        error_found = true;
    }

    if (!port.trim()) {
        _errors.port = true;
        error_found = true;
    }

    if (!maxInstance.trim()) {
        _errors.maxInstance = true;
        error_found = true;
    }

    if (!maxSession.trim()) {
        _errors.maxSession = true;
        error_found = true;
    }

    if (!username.trim()) {
        _errors.username = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}

