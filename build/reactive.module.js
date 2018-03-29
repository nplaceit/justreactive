let computationId = 0;

class Computation {

    constructor(handler, thisObject) {
        this.handler = handler;
        this.handlerThisObject = thisObject;
        this._invalidateCallbacks = [];
        this.id = computationId++;
    }

    execute() {
        Reactive$1.active = false;
        const result = this.handler.call(this.handlerThisObject);
        Reactive$1.active = true;
        return result;
    }

    invalidate() {
        for (const handler of this._invalidateCallbacks) {
            handler(this);
        }
        this._invalidateCallbacks = [];
        this.execute();
    }

    onInvalidate(handler) {
        this._invalidateCallbacks.push(handler);
    }

}

Reactive$1.trackingActive = true;
Reactive$1.isRecomputing = false;

function Reactive$1(handler, thisObject) {
    if (Reactive$1.active) {
        Reactive$1.currentComputation = new Computation(handler, thisObject);
        const result = Reactive$1.currentComputation.execute();
        Reactive$1.currentComputation = null;
        return result;
    } else {
        return handler();
    }
}

function notReactive(handler, thisObject) {

    if (Reactive$1.isRecomputing) {
        return;
    }

    const previousState = Reactive$1.trackingActive;

    Reactive$1.trackingActive = false;

    handler.call(thisObject);

    Reactive$1.trackingActive = previousState;

}

Reactive$1.active = true;
Reactive$1.currentComputation = null;

class Dependency {

    constructor() {
        this.computations = {};
    }

    depends() {
        if (Reactive$1.trackingActive && Reactive$1.currentComputation && !(Reactive$1.currentComputation.id in this.computations)) {
            this.computations[Reactive$1.currentComputation.id] = Reactive$1.currentComputation;
            Reactive$1.currentComputation.onInvalidate(computation => {
                delete this.computations[computation.id];
            });
        }
    }

    changed() {

        if (!Reactive$1.active) {
            return;
        }

        for (const [, computation] of Object.entries(this.computations)) {

            const previousComputation = Reactive$1.currentComputation;
            const previouslyComputing = Reactive$1.isRecomputing;

            Reactive$1.isRecomputing = true;
            Reactive$1.currentComputation = computation;
            computation.invalidate();

            Reactive$1.currentComputation = previousComputation;
            Reactive$1.isRecomputing = previouslyComputing;

        }
    }

}

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

function reactiveObject(object = {}) {
    const newObject = {};
    for (const [property, value] of Object.entries(object)) {
        reactiveProperty(newObject, property, value);
    }
    return newObject;
}

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

Reactive$1.not = notReactive;
Reactive$1.property = reactiveProperty;
Reactive$1.object = reactiveObject;
Reactive$1.proxy = reactiveProxy;
Reactive$1.var = reactiveVar;
Reactive$1.array = reactiveArray;
Reactive$1.Dependency = Dependency;

export default Reactive$1;
