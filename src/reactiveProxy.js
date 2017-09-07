import {reactiveObject} from "./reactiveObject";
import {reactiveProperty} from "./reactiveProperty";

function reactiveProxy(obj = {}) {

    obj = reactiveObject(obj);

    return new Proxy(obj, {
        get: function (target, name) {
            if (!(name in target)) {
                reactiveProperty(target, name);
            }
            return target[name];
        },
        set: function (target, name, value) {
            if (!(name in target)) {
                reactiveProperty(target, name, value);
            }
            return target[name] = value;
        }
    });

}

export {reactiveProxy};