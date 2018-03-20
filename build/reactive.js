(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Reactive = factory());
}(this, (function () { 'use strict';

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
	        this.handler.call(this.handlerThisObject);
	        Reactive$1.active = true;
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
	        Reactive$1.currentComputation.execute();
	        Reactive$1.currentComputation = null;
	    } else {
	        handler();
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

	    valueOf() {
	        return this.get();
	    }

	    toString() {
	        return String(this.valueOf());
	    }

	}

	Reactive$1.not = notReactive;
	Reactive$1.property = reactiveProperty;
	Reactive$1.object = reactiveObject;
	Reactive$1.proxy = reactiveProxy;
	Reactive$1.Var = ReactiveVar;
	Reactive$1.Dependency = Dependency;

	return Reactive$1;

})));
