import {Dependency} from "./Dependency";

class ReactiveVar {

    constructor(defaultValue) {
        this.dependency = new Dependency;
        this.currentValue = defaultValue;
    }

    get() {
        this.dependency.depends();
        return this.currentValue;
    }

    set(val) {
        if (this.currentValue !== val) {
            this.currentValue = val;
            this.dependency.changed();
        }
        return val;
    }

    [Symbol.toPrimitive]() {
        return this.get();
    }

}

function reactiveVar(defaultValue) {
    return new ReactiveVar(defaultValue);
}

export {reactiveVar};