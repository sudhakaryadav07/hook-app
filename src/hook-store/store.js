
import { useState, useEffect } from 'react';

let globalState = {};
let listeners = [];
let actions = {};

export const useStore = () => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = { ...globalState, ...newState };

        for (let listener of listeners) {
            listener(globalState);
        }
    }

    useEffect(() => {
        listeners.push(setState);

        console.log(listeners)
        return () => {
            listeners = listeners.filter(li => li !== setState);
        }
    }, [setState])
    const serializeJSON = JSON.stringify(globalState);
    localStorage.setItem("state", serializeJSON);
    return [globalState, dispatch];
}


export const initStore = (userActions, initialState) => {
    if (initialState) {
        globalState = { ...globalState, ...initialState };
    }

    actions = { ...actions, ...userActions }
}