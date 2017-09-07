import {Reactive} from './Reactive';

let computationId = 0;

class Computation {

    constructor(handler, thisObject) {
        this.handler = handler;
        this.handlerThisObject = thisObject;
        this._invalidateCallbacks = [];
        this.id = computationId++;
    }

    execute() {
        Reactive.active = false;
        this.handler.call(this.handlerThisObject);
        Reactive.active = true;
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

export {Computation};