import {Reactive} from "./Reactive";

class Dependency {

    constructor() {
        this.computations = {};
    }

    depends() {
        if (Reactive.trackingActive && Reactive.currentComputation && !(Reactive.currentComputation.id in this.computations)) {
            this.computations[Reactive.currentComputation.id] = Reactive.currentComputation;
            Reactive.currentComputation.onInvalidate(computation => {
                delete this.computations[computation.id];
            });
        }
    }

    changed() {
        for (const [, computation] of Object.entries(this.computations)) {

            const previousComputation = Reactive.currentComputation;
            const previouslyComputing = Reactive.isRecomputing;

            Reactive.isRecomputing = true;
            Reactive.currentComputation = computation;
            computation.invalidate();

            Reactive.currentComputation = previousComputation;
            Reactive.isRecomputing = previouslyComputing;

        }
    }

}

export {Dependency};