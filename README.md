# just-reactive
Ultra light-weight JavaScript reactive programming library.

## Reactive Variable

```javascript

const foo = Reactive.var(0);

Reactive(() =>
    console.log(foo.get()) //or via primitive call +foo
);

setInterval(() => foo.set(foo + 1), 500);

```

## Reactive Object Properties

```javascript

const foo = Reactive.object({bar: 0});

Reactive(() =>
    console.log(foo.bar)
);

setInterval(() => foo.bar++, 500);

```

## Reactive Proxy Object

```javascript

const foo = Reactive.proxy();

foo.bar = 0; //every defined proxy property is reactive

Reactive(() =>
    console.log(foo.bar)
);

setInterval(() => foo.bar++, 500);

```

## Download the library

Install via [npm](https://www.npmjs.com)

```bash
$ npm install justreactive --save
```