import {reactiveProperty} from "./reactiveProperty";

function reactiveObject(object = {}) {
    const newObject = {};
    for (const [property, value] of Object.entries(object)) {
        reactiveProperty(newObject, property, value);
    }
    return newObject;
}

export {reactiveObject};