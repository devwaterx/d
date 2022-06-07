// Incomplete

navigator.serviceWorker.register = new Proxy(Navigator.serviceWorker.register, {
	apply(target, that, args) {
		args[0] = wrap(args[0]);

		return Reflect.apply(...arguments);
	}
});

worker = new Proxy(worker, {
	construct(target, args) {
		return Reflect.construct(target, args);
	}
});

// Chrome exclusive
// https://html.spec.whatwg.org/multipage/worklets.html

worklet.addModule = null;