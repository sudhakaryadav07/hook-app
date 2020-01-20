
export const ticketValidate = (_model) => {

    const { description, action, category, status } = _model

    let _errors = {};
    let error_found = false;

    if (!description.trim()) {
        _errors.description = true;
        error_found = true;
    }

    if (!action) {
        _errors.action = true;
        error_found = true;
    }

    if (!category) {
        _errors.category = true;
        error_found = true;
    }

    if (!status) {
        _errors.status = true;
        error_found = true;
    }

    let vObj = { errors: _errors, errorFound: error_found };
    return vObj;

}