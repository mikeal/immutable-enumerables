# Immutable Enumberables

This document describes a JavaScript coding style. It does not require any tooling,
dependencies, or libraries of any kind. The code style is compatible with all well known
style guides and linter configurations.

JavaScript lacks a lot of features you'd want for creating immutable types and also has
a lot of problematic behavior when creating custom types (lack of reliable instanceof check
across module versions).

The immutable enumerable style leverages a few modern JavaScript features along with
well established patterns that functional programming languages have been
using for a long time. While types defined using this style lack complete immutability
they also avoid JavaScript performance issues with features like `Object.freeze`.

Let's jump right in and create our first type.

```js
const { entries, fromEntries, defineProperties } = Object
const immen = { writable: false, enumberable: true }
const mapProps = ([key, value]) => [key, {value, ...immen }]
const lock = (obj, props) => defineProperties(obj, fromEntries(entries(props).map(mapProps)))

class MyType {
  constructor ({ one, two, three }) {
    const four = 4
    lock(this, { one, two, three, four })  
  }
  get asMyType () {
    return this
  }
}

export default MyType
```

If you would prefer a dependency rather than copying the above implementation of the lock function you can do
the following:

```
npm install immutable-enumerables
```

```js
import { lock } from 'immutable-enumerables'
```

Ok, let's talk about what we do for all types written in this style.

1. We define classes with a constructor that accepts only a single object.
2. We pluck out the arguments passed into the constructor (using destructuring) that we have assigned some meaning to in this type.
3. We create any additional immutable state we want to assign to the type.
4. We "lock" these properties (and only these properties) to the class instance.
5. Our locked properties are the only enumerable properties on this class instance.
6. We have a single getter for `asMyType` that returns this instance.

Let's see what we can do with this.

```js
const xx = new MyType({one: 1, two: 2, three: 3})
const yy = new MyType({...xx}) // copy
const zz = new MyType({...yy, two: 'two' }) // copy but overwrite one property
const makeThree = three => new MyType({...xx, three})
```

Pretty cool! A few things to note:

1. Using splats and de-structuring the language gives us everything we need for fast copies.
2. If you use good property names this pattern provides a nice form of documentation throughout
   your code since all de-structured names must remain consistent and constructors effectively "declare"
   the properties they require.
3. Unlike positional arguments, property names must be consistent, so these conventions persist well
   beyond the implementation and are consistent across all consumers of this type.

This gives us a nice blend of safety and performance in JavaScript. The properties we deem important are set as
immutable and we can copy and de-structure properties out of the type easily using the language since these
properties are the only ones set to be immutable. We may not have the assurances that true immutable types would
give us but JavaScript doesn't have those (yet).

## Type Checking

Something as simple as checking if a variable is a particular type is quite an issue in JavaScript. Due to the
realities of the JS ecoystem and how Node.js/npm resolve dependencies, we can often end up with two slightly
different version of the same module in the same program. This means that we can't reliably use `instanceof`
checks.

Many people use custom symbols in order to work around this but the problem with symbols is that they don't
cross Worker boundaries in the browser. We want a fast mechanism for type checking and we want these types
to be passed through worker boundaries.

```js
if (zz.asMyType === zz) doSomething()
```

Circular references **do** make it across worker boundaries, and property names will have as consistent a name
as you can provide to a symbol so this method of type checking works quite well and is incredibly performant
since it's only a simple pointer check.

Immutable Enumbables give you:

* Patterns for creating new types that have immutablity of **specific properties**.
* Flexible type checking that work within the limits of JavaScript and through worker boundaries.
* 