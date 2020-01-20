export const validateName = (_model) => {

    const { name } = _model

    let _errors = {};
    let error_found = false;

    if (!name.trim()) {
        _errors.name = true;
        error_found = true;
    }

    if (!name.match(/^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\?*:\"";<>|/]+$/)) {
        _errors.name = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const validateFolder = (_model) => {

    const { folder } = _model
    let _errors = {};
    let error_found = false;

    if (!folder.trim()) {
        _errors.folder = true;
        error_found = true;
    }

    if (!folder.match(/^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\?*:\"";<>|/]+$/)) {
        _errors.folder = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const validateDesc = (_model) => {

    const { desc } = _model

    let _errors = {};
    let error_found = false;

    if (!desc.trim()) {
        _errors.desc = true;
        error_found = true;
    }

    if (!desc.match(/^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\?*:\"";<>|/]+$/)) {
        _errors.desc = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const datasetValidate = (_model) => {

    const { data } = _model

    let _errors = {};
    let error_found = false;

    if (!data.trim()) {
        _errors.data = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const stepValidate = (_model) => {

    const { field ,action} = _model

    let _errors = {};
    let error_found = false;

    if (!field.trim()) {
        _errors.field = true;
        error_found = true;
    }

    if (!action) {
        _errors.action = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const validateTestsuit = (_model) => {

    const { desc, platform } = _model

    let _errors = {};
    let error_found = false;

    if (!desc.trim()) {
        _errors.desc = true;
        error_found = true;
    }

    if (!desc.match(/^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\?*:\"";<>|/]+$/)) {
        _errors.desc = true;
        error_found = true;
    }

    if (!platform.trim()) {
        _errors.platform = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const validateProject = (_model) => {

    const { client, project } = _model

    let _errors = {};
    let error_found = false;

    if (!client) {
        _errors.client = true;
        error_found = true;
    }

    if (!project) {
        _errors.project = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}

export const projectDetailsValidate= (_model) => {

    const { baseUrl, buildNo} = _model

    let _errors = {};
    let error_found = false;

    if (!baseUrl.trim()) {
        _errors.baseUrl = true;
        error_found = true;
    }

    if (!buildNo.trim()) {
        _errors.buildNo = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;
}
