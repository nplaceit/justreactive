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