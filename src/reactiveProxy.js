import {Dependency} from "./Dependency";

function prepareDependency(dependencies, name) {
    if (!(name in dependencies)) {
        dependencies[name] = new Dependency();
    }
}

function reactiveProxy(obj = {}) {

    const dependencies = {};

    const genericDep = new Dependency();

    return new Proxy(obj, {
        get: function (target, name) {
            prepareDependency(dependencies, name);
            dependencies[name].depends();

            return target[name];
        },
        set: function (target, name, value) {

            const prev = name in target;

            target[name] = value;

            if (!prev) {
                genericDep.changed();
            }

            if (name in dependencies) {
                dependencies[name].changed();
            }

            return value;
        },
        has(target, name) {
            prepareDependency(dependencies, name);
            dependencies[name].depends();

            return name in target;
        },
        deleteProperty(target, name) {

            if (name in target) {
                delete target[name];
                genericDep.changed();
            }

            if (name in dependencies) {
                dependencies[name].changed();
            }

        },
        ownKeys(target) {
            genericDep.depends();
            return Object.getOwnPropertyNames(target);
        }
    });

}

export {reactiveProxy};