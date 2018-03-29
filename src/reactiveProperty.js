import {Dependency} from "./Dependency";

function reactiveProperty(object, name, defaultValue, stock) {

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

    if (stock) {
        if (!stock.dependencyFor) {
            Object.defineProperty(stock, 'dependencyFor', {
                enumerable: false,
                value: {}
            })
        }

        stock.dependencyFor[name] = dep;
    }

    return defaultValue;

}

export {reactiveProperty};