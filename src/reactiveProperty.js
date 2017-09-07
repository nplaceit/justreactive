import {Dependency} from "./Dependency";

function reactiveProperty(object, name, defaultValue) {

    const dep = new Dependency;

    let val = defaultValue !== undefined ? defaultValue : object[name];

    Object.defineProperty(object, name, {
        set(v) {
            if (val !== v) {
                val = v;
                dep.changed();
            }
        },
        get() {
            dep.depends();
            return val;
        }
    });

    return defaultValue;

}

export {reactiveProperty};