import {Dependency} from "./Dependency";

function extendChange(reactiveArray, method, args) {
    const res = method.apply(reactiveArray, args);
    reactiveArray._dep.changed();
    return res;
}

function extendDepend(reactiveArray, method, args) {
    reactiveArray._dep.depends();
    return method.apply(reactiveArray, args);
}

class ReactiveArray extends Array {

    constructor() {
        super(...arguments);

        Object.defineProperties(this, {
            _dep: {
                value: new Dependency(),
                enumerable: false
            }
        });

    }

    set len(length) {
        this.length = length;
        this._dep.changed();
    }

    get len() {
        this._dep.depends();
        return this.length;
    }

    set(index, value) {
        this[index] = value;
        this._dep.changed();
    }

    get(index) {
        this._dep.depends();
        return this[index];
    }

    push() {
        return extendChange(this, super.push, arguments);
    }

    pop() {
        return extendChange(this, super.pop, arguments);
    }

    unshift() {
        return extendChange(this, super.unshift, arguments);
    }

    splice() {
        return extendChange(this, super.splice, arguments);
    }

    fill() {
        return extendChange(this, super.fill, arguments);
    }

    reverse() {
        return extendChange(this, super.reverse, arguments);
    }

    sort() {
        return extendChange(this, super.sort, arguments);
    }

    //

    concat() {
        return extendDepend(this, super.concat, arguments);
    }

    copyWithin() {
        return extendDepend(this, super.copyWithin, arguments);
    }

    entries() {
        return extendDepend(this, super.entries, arguments);
    }

    every() {
        return extendDepend(this, super.every, arguments);
    }

    filter() {
        return extendDepend(this, super.filter, arguments);
    }

    find() {
        return extendDepend(this, super.find, arguments);
    }

    findIndex() {
        return extendDepend(this, super.findIndex, arguments);
    }

    forEach() {
        return extendDepend(this, super.forEach, arguments);
    }

    includes() {
        return extendDepend(this, super.includes, arguments);
    }

    indexOf() {
        return extendDepend(this, super.indexOf, arguments);
    }

    join() {
        return extendDepend(this, super.join, arguments);
    }

    keys() {
        return extendDepend(this, super.keys, arguments);
    }

    map() {
        return extendDepend(this, super.map, arguments);
    }

    lastIndexOf() {
        return extendDepend(this, super.lastIndexOf, arguments);
    }

    reduce() {
        return extendDepend(this, super.reduce, arguments);
    }

    reduceRight() {
        return extendDepend(this, super.reduceRight, arguments);
    }

    some() {
        return extendDepend(this, super.some, arguments);
    }

    toLocaleString() {
        return extendDepend(this, super.toLocaleString, arguments);
    }

    * [Symbol.iterator]() {
        this._dep.depends();
        yield* super[Symbol.iterator]();
    }

}

function reactiveArray() {
    return new ReactiveArray(...arguments);
}

export {reactiveArray};