//as modules
//export {Reactive as it, notReactive as not} from './Reactive';
//export {reactiveProperty as property} from "./reactiveProperty";
//export {reactiveObject as object} from "./reactiveObject";
//export {reactiveProxy as proxy} from "./reactiveProxy";
//export {ReactiveVar as Var} from "./reactiveVar";

import {notReactive, Reactive} from "./Reactive";
import {reactiveProperty} from "./reactiveProperty";
import {reactiveObject} from "./reactiveObject";
import {reactiveProxy} from "./reactiveProxy";
import {ReactiveVar} from "./reactiveVar";
import {Dependency} from "./Dependency";

Reactive.not = notReactive;
Reactive.property = reactiveProperty;
Reactive.object = reactiveObject;
Reactive.proxy = reactiveProxy;
Reactive.Var = ReactiveVar;
Reactive.Dependency = Dependency;

export default Reactive;