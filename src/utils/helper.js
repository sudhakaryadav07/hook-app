import moment from 'moment';

export const DropdownFormat = async (data) => {
    try {
        let formatedData = await data.map((data, i) => {
            let { _id, name } = data;
            return { key: "client" + _id, label: name, value: _id };
        });
        return formatedData;
    } catch (e) {
        console.log(e);
    }
};

export const findNameById = async (list, id) => {
    try {
        let result = await list.filter((data) => { return (data.value === id) });
        return result[0];
    } catch (e) {
        console.log(e);
    }
}

export const stepChecker = async (testcase, item) => {
    try {
        let { step } = testcase;
        let isDuplicate = false;

        if (step && step.length > 0) {
            await step.map((data, i) => {
                let { field } = data;
                if (field === item.field) {
                    isDuplicate = true;
                }
                return null;
            });
        } else {
            isDuplicate = false;
        }
        return isDuplicate;

    } catch (e) {
        console.log(e);
    }
}

export const getSeq = async (testcase) => {
    let { step } = testcase;
    let seq = null;
    if (step.length === 0) {
        seq = 0;
    } else {
        seq = Math.max.apply(Math, step.map(function (item) { return item.seq; }));
    }
    return seq++;
}

export const datasetChecker = async (testcase, item) => {
    try {
        let { dataSet } = testcase;
        let isDuplicate = null;

        if (dataSet && dataSet.length > 0) {
            await dataSet.map((temp, i) => {
                let { data } = item;
                let tdata = data.replace('T - ', '');
                if (temp.data === tdata) {
                    isDuplicate = true;
                } else {
                    isDuplicate = false;
                }
                return null;
            });
        } else {
            isDuplicate = false;
        }

        return isDuplicate;

    } catch (e) {
        console.log(e);
    }
}

export const makeDataset = async (testcase, dataSet, dataField, userId) => {
    let { _id, project } = testcase;
    let model = { testcase: _id, project: project };
    await dataSet.map((item) => {
        let { data, value, auto, type } = item;
        if (data === dataField) {
            model = { ...model, data, value, auto, type, createdBy: userId };
        }
        return null;
    });
    return model;
}

export const seqMaker = async (testcase, item, userId) => {
    try {
        let { _id, project, step } = testcase;

        let seq, model = null;
        if (step.length === 0) {
            seq = 0;
        } else {
            seq = Math.max.apply(Math, step.map(function (item) { return item.seq; }));
        }
        seq++;
        let { action, field, locator, type, data,locatorData,dataValue } = item;
        let locatorArray = [];
        locatorArray.push({ id: locator, type, data: locatorData });
        if (action === "write" || action === "select" || action === "is" || action === "goto" ||
            action === "wait" || action === "isurl" || action === "isalert" || action === "isnoturl" || action === "isurlcontains") {
            model = { seq: seq, field, action: action, locator: locatorArray, condition: "true", data: "T - " + field, testcase: _id, project,dataValue, createdBy: userId };
        } else {
            model = { seq: seq, field, action: action, locator: locatorArray, condition: "true", data, testcase: _id, project, createdBy: userId };
        }
        return model;
    } catch (e) {
        console.log(e);
    }
}

export const StepMaker = async (data) => {
    try {
        let chunklen = 6
        let chunked = [];
        let stepArray = [];

        data.split('~').map((item, i) => {
            let last = chunked[chunked.length - 1];
            if (!last || last.length === chunklen) {
                chunked.push([item]);
            } else {
                last.push(item)
            }
            return false;
        });

        chunked.map((data, i) => {
            let output = Object.assign({}, data);
            stepArray.push({ action: output[0], field: output[1], locator: output[2], type: output[3], dataValue: output[4],locatorData: output[5] });
            return false;
        });
        return stepArray;
    } catch (e) {
        console.log(e);
    }
}

export const getTime = () => {
    return moment().format('hh:mm:ss.SS');
}


export const getAutomaticStep = (event,model) => {
    let automaticStep = {};

    let step = event.target.value;
        let field = "Auto" + Math.floor(Math.random() * 90 + 10);
        let data = "T - " + field;
        if (step === "wait") {
            model = { ...model, field: field, action: "wait", data: data, condition: true };
        }else if (step === "goto") {
            model = { ...model, field: field, action: "goto", data: data, condition: true };
        }else if (step === "back") {
            model = { ...model, field: field, action: "back", data: null, condition: true };
        }else if (step === "isurl") {
            model = { ...model, field: field, action: "isurl", data: data, condition: true };
        }else if (step === "tabkey") {
            model = { ...model, field: field, action: "tabkey", data: null, condition: true };
        }else if (step === "endkey") {
            model = { ...model, field: field, action: "endkey", data: null, condition: true };
        }else if (step === "zoomin") {
            model = { ...model, field: field, action: "zoomin", data: null, condition: true };
        }else if (step === "homekey") {
            model = { ...model, field: field, action: "homekey", data: null, condition: true };
        }else if (step === "zoomout") {
            model = { ...model, field: field, action: "zoomout", data: null, condition: true };
        }else if (step === "isalert") {
            model = { ...model, field: field, action: "isalert", data: data, condition: true };
        }else if (step === "execute") {
            model = { ...model, field: field, action: "execute", data: null, condition: true };
        }else if (step === "ScrollUp") {
            model = { ...model, field: field, action: "ScrollUp", data: null, condition: true };
        }else if (step === "enterkey") {
            model = { ...model, field: field, action: "enterkey", data: null, condition: true };
        }else if (step === "isnoturl") {
            model = { ...model, field: field, action: "isnoturl", data: data, condition: true };
        }else if (step === "spacebar") {
            model = { ...model, field: field, action: "spacebar", data: null, condition: true };
        }else if (step === "escapekey") {
            model = { ...model, field: field, action: "escapekey", data: null, condition: true };
        }else if (step === "deletekey") {
            model = { ...model, field: field, action: "deletekey", data: null, condition: true };
        }else if (step === "pageupkey") {
            model = { ...model, field: field, action: "pageupkey", data: null, condition: true };
        }else if (step === "selectall") {
            model = { ...model, field: field, action: "selectall", data: null, condition: true };
        }else if (step === "ScrollLeft") {
            model = { ...model, field: field, action: "ScrollLeft", data: null, condition: true };
        }else if (step === "uparrowkey") {
            model = { ...model, field: field, action: "uparrowkey", data: null, condition: true };
        }else if (step === "ScrollDown") {
            model = { ...model, field: field, action: "ScrollDown", data: null, condition: true };
        }else if (step === "closepopup") {
            model = { ...model, field: field, action: "closepopup", data: null, condition: true };
        }else if (step === "closealert") {
            model = { ...model, field: field, action: "closealert", data: null, condition: true };
        }else if (step === "switchframe") {
            model = { ...model, field: field, action: "switchframe", data: null, condition: true };
        }else if (step === "ScrollRight") {
            model = { ...model, field: field, action: "ScrollRight", data: null, condition: true };
        }else if (step === "pagedownkey") {
            model = { ...model, field: field, action: "pagedownkey", data: null, condition: true };
        }else if (step === "acceptalert") {
            model = { ...model, field: field, action: "acceptalert", data: null, condition: true };
        }else if (step === "leftarrowkey") {
            model = { ...model, field: field, action: "leftarrowkey", data: null, condition: true };
        }else if (step === "downarrowkey") {
            model = { ...model, field: field, action: "downarrowkey", data: null, condition: true };
        } else if (step === "backspacekey") {
            model = { ...model, field: field, action: "backspacekey", data: null, condition: true };
        }else if (step === "clearcookies") {
            model = { ...model, field: field, action: "clearcookies", data: null, condition: true };
        }else if (step === "rightarrowkey") {
            model = { ...model, field: field, action: "rightarrowkey", data: null, condition: true };
        }else if (step === "alertis") {
            model = { ...model, field: field, action: "alertis", data: null, condition: true };
        }else if (step === "alertcontains") {
            model = { ...model, field: field, action: "alertcontains", data: null, condition: true };
        }else if (step === "isurlcontains") {
            model = { ...model, field: field, action: "isurlcontains", data: data, condition: true };
        }else if (step === "SwitchDefaultFrame") {
            model = { ...model, field: field, action: "SwitchDefaultFrame", data: null, condition: true };
        }else if (step === "switchtopopup") {
            model = { ...model, field: field, action: "switchtopopup", data: null, condition: true };
        }  
    return {...automaticStep,model,step}
}
     

