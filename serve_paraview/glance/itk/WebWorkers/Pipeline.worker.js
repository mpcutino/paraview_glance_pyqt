(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],2:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],3:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],4:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],5:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":4}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TinyEmitter = require('./tiny-emitter');

var MESSAGE_RESULT = 0;
var MESSAGE_EVENT = 1;

var RESULT_ERROR = 0;
var RESULT_SUCCESS = 1;

var DEFAULT_HANDLER = 'main';

var isPromise = function isPromise(o) {
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && typeof o.then === 'function' && typeof o.catch === 'function';
};

function RegisterPromise(fn) {
  var handlers = _defineProperty({}, DEFAULT_HANDLER, fn);
  var sendPostMessage = self.postMessage.bind(self);

  var server = new (function (_TinyEmitter) {
    _inherits(WorkerRegister, _TinyEmitter);

    function WorkerRegister() {
      _classCallCheck(this, WorkerRegister);

      return _possibleConstructorReturn(this, (WorkerRegister.__proto__ || Object.getPrototypeOf(WorkerRegister)).apply(this, arguments));
    }

    _createClass(WorkerRegister, [{
      key: 'emit',
      value: function emit(eventName) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        sendPostMessage({ eventName: eventName, args: args });
        return this;
      }
    }, {
      key: 'emitLocally',
      value: function emitLocally(eventName) {
        var _get2;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        (_get2 = _get(WorkerRegister.prototype.__proto__ || Object.getPrototypeOf(WorkerRegister.prototype), 'emit', this)).call.apply(_get2, [this, eventName].concat(args));
      }
    }, {
      key: 'operation',
      value: function operation(name, handler) {
        handlers[name] = handler;
        return this;
      }
    }]);

    return WorkerRegister;
  }(TinyEmitter))();

  var run = function run(messageId, payload, handlerName) {

    var onSuccess = function onSuccess(result) {
      if (result && result instanceof TransferableResponse) {
        sendResult(messageId, RESULT_SUCCESS, result.payload, result.transferable);
      } else {
        sendResult(messageId, RESULT_SUCCESS, result);
      }
    };

    var onError = function onError(e) {
      sendResult(messageId, RESULT_ERROR, {
        message: e.message,
        stack: e.stack
      });
    };

    try {
      var result = runFn(messageId, payload, handlerName);
      if (isPromise(result)) {
        result.then(onSuccess).catch(onError);
      } else {
        onSuccess(result);
      }
    } catch (e) {
      onError(e);
    }
  };

  var runFn = function runFn(messageId, payload, handlerName) {
    var handler = handlers[handlerName || DEFAULT_HANDLER];
    if (!handler) throw new Error('Not found handler for this request');

    return handler(payload, sendEvent.bind(null, messageId));
  };

  var sendResult = function sendResult(messageId, success, payload) {
    var transferable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    sendPostMessage([MESSAGE_RESULT, messageId, success, payload], transferable);
  };

  var sendEvent = function sendEvent(messageId, eventName, payload) {
    if (!eventName) throw new Error('eventName is required');

    if (typeof eventName !== 'string') throw new Error('eventName should be string');

    sendPostMessage([MESSAGE_EVENT, messageId, eventName, payload]);
  };

  self.addEventListener('message', function (_ref) {
    var data = _ref.data;

    if (Array.isArray(data)) {
      run.apply(undefined, _toConsumableArray(data));
    } else if (data && data.eventName) {
      server.emitLocally.apply(server, [data.eventName].concat(_toConsumableArray(data.args)));
    }
  });

  return server;
}

var TransferableResponse = function TransferableResponse(payload, transferable) {
  _classCallCheck(this, TransferableResponse);

  this.payload = payload;
  this.transferable = transferable;
};

module.exports = RegisterPromise;
module.exports.TransferableResponse = TransferableResponse;
},{"./tiny-emitter":7}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyEmitter = function () {
  function TinyEmitter() {
    _classCallCheck(this, TinyEmitter);

    Object.defineProperty(this, '__listeners', {
      value: {},
      enumerable: false,
      writable: false
    });
  }

  _createClass(TinyEmitter, [{
    key: 'emit',
    value: function emit(eventName) {
      if (!this.__listeners[eventName]) return this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.__listeners[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handler = _step.value;

          handler.apply(undefined, args);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: 'once',
    value: function once(eventName, handler) {
      var _this = this;

      var once = function once() {
        _this.off(eventName, once);
        handler.apply(undefined, arguments);
      };

      return this.on(eventName, once);
    }
  }, {
    key: 'on',
    value: function on(eventName, handler) {
      if (!this.__listeners[eventName]) this.__listeners[eventName] = [];

      this.__listeners[eventName].push(handler);

      return this;
    }
  }, {
    key: 'off',
    value: function off(eventName, handler) {
      if (handler) this.__listeners[eventName] = this.__listeners[eventName].filter(function (h) {
        return h !== handler;
      });else this.__listeners[eventName] = [];

      return this;
    }
  }]);

  return TinyEmitter;
}();

module.exports = TinyEmitter;
},{}],8:[function(require,module,exports){
"use strict";

var Float32 = 'float';
var Float64 = 'double';
var SpacePrecisionType = 'double';
module.exports = {
  Float32: Float32,
  Float64: Float64,
  SpacePrecisionType: SpacePrecisionType
};

},{}],9:[function(require,module,exports){
"use strict";

var Text = 'Text';
var Binary = 'Binary';
var Image = 'Image';
var Mesh = 'Mesh';
var vtkPolyData = 'vtkPolyData';
module.exports = {
  Text: Text,
  Binary: Binary,
  Image: Image,
  Mesh: Mesh,
  vtkPolyData: vtkPolyData
};

},{}],10:[function(require,module,exports){
"use strict";

var Int8 = 'int8_t';
var UInt8 = 'uint8_t';
var Int16 = 'int16_t';
var UInt16 = 'uint16_t';
var Int32 = 'int32_t';
var UInt32 = 'uint32_t';
var Int64 = 'int64_t';
var UInt64 = 'uint64_t';
var SizeValueType = UInt64;
var IdentifierType = SizeValueType;
var IndexValueType = Int64;
var OffsetValueType = Int64;
module.exports = {
  Int8: Int8,
  UInt8: UInt8,
  Int16: Int16,
  UInt16: UInt16,
  Int32: Int32,
  UInt32: UInt32,
  Int64: Int64,
  UInt64: UInt64,
  SizeValueType: SizeValueType,
  IdentifierType: IdentifierType,
  IndexValueType: IndexValueType,
  OffsetValueType: OffsetValueType
};

},{}],11:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _register = _interopRequireDefault(require("webworker-promise/lib/register"));

var _loadEmscriptenModuleBrowser = _interopRequireDefault(require("../loadEmscriptenModuleBrowser"));

var _runPipelineEmscripten = _interopRequireDefault(require("../runPipelineEmscripten"));

var _IOTypes = _interopRequireDefault(require("../IOTypes"));

var _getTransferable = _interopRequireDefault(require("../getTransferable"));

// To cache loaded pipeline modules
var pipelinePathToModule = {};

function loadPipelineModule(moduleDirectory, pipelinePath, config, isAbsoluteURL) {
  var pipelineModule = null;

  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath];
  } else {
    pipelinePathToModule[pipelinePath] = (0, _loadEmscriptenModuleBrowser["default"])(config.itkModulesPath, moduleDirectory, pipelinePath, isAbsoluteURL);
    pipelineModule = pipelinePathToModule[pipelinePath];
  }

  return pipelineModule;
}

function runPipeline(_x, _x2, _x3, _x4) {
  return _runPipeline.apply(this, arguments);
}

function _runPipeline() {
  _runPipeline = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(pipelineModule, args, outputs, inputs) {
    var result, transferables;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            result = (0, _runPipelineEmscripten["default"])(pipelineModule, args, outputs, inputs);
            transferables = [];

            if (result.outputs) {
              result.outputs.forEach(function (output) {
                if (output.type === _IOTypes["default"].Binary) {
                  // Binary data
                  var transferable = (0, _getTransferable["default"])(output.data);

                  if (transferable) {
                    transferables.push(transferable);
                  }
                } else if (output.type === _IOTypes["default"].Image) {
                  // Image data
                  var _transferable = (0, _getTransferable["default"])(output.data.data);

                  if (_transferable) {
                    transferables.push(_transferable);
                  }
                } else if (output.type === _IOTypes["default"].Mesh) {
                  // Mesh data
                  if (output.data.points) {
                    var _transferable2 = (0, _getTransferable["default"])(output.data.points);

                    if (_transferable2) {
                      transferables.push(_transferable2);
                    }
                  }

                  if (output.data.pointData) {
                    var _transferable3 = (0, _getTransferable["default"])(output.data.pointData);

                    if (_transferable3) {
                      transferables.push(_transferable3);
                    }
                  }

                  if (output.data.cells) {
                    var _transferable4 = (0, _getTransferable["default"])(output.data.cells);

                    if (_transferable4) {
                      transferables.push(_transferable4);
                    }
                  }

                  if (output.data.cellData) {
                    var _transferable5 = (0, _getTransferable["default"])(output.data.cellData);

                    if (_transferable5) {
                      transferables.push(_transferable5);
                    }
                  }
                } else if (output.type === _IOTypes["default"].vtkPolyData) {
                  // vtkPolyData data
                  var polyData = output.data;
                  var cellTypes = ['points', 'verts', 'lines', 'polys', 'strips'];
                  cellTypes.forEach(function (cellName) {
                    if (polyData[cellName]) {
                      var _transferable6 = (0, _getTransferable["default"])(polyData[cellName]);

                      if (_transferable6) {
                        transferables.push(_transferable6);
                      }
                    }
                  });
                  var dataSetType = ['pointData', 'cellData', 'fieldData'];
                  dataSetType.forEach(function (dataName) {
                    if (polyData[dataName]) {
                      var data = polyData[dataName];
                      data.arrays.forEach(function (array) {
                        var transferable = (0, _getTransferable["default"])(array.data);

                        if (transferable) {
                          transferables.push(transferable);
                        }
                      });
                    }
                  });
                }
              });
            }

            return _context2.abrupt("return", new _register["default"].TransferableResponse(result, transferables));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _runPipeline.apply(this, arguments);
}

(0, _register["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(input) {
    var pipelineModule;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pipelineModule = null;

            if (!(input.operation === 'runPipeline')) {
              _context.next = 5;
              break;
            }

            pipelineModule = loadPipelineModule('Pipelines', input.pipelinePath, input.config, input.isAbsoluteURL);
            _context.next = 10;
            break;

          case 5:
            if (!(input.operation === 'runPolyDataIOPipeline')) {
              _context.next = 9;
              break;
            }

            pipelineModule = loadPipelineModule('PolyDataIOs', input.pipelinePath, input.config, input.isAbsoluteURL);
            _context.next = 10;
            break;

          case 9:
            throw new Error('Unknown worker operation');

          case 10:
            return _context.abrupt("return", runPipeline(pipelineModule, input.args, input.outputs, input.inputs));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x5) {
    return _ref.apply(this, arguments);
  };
}());

},{"../IOTypes":9,"../getTransferable":13,"../loadEmscriptenModuleBrowser":14,"../runPipelineEmscripten":15,"@babel/runtime/helpers/asyncToGenerator":1,"@babel/runtime/helpers/interopRequireDefault":2,"@babel/runtime/regenerator":5,"webworker-promise/lib/register":6}],12:[function(require,module,exports){
"use strict";

var IntTypes = require('./IntTypes.js');

var FloatTypes = require('./FloatTypes.js');

var bufferToTypedArray = function bufferToTypedArray(jsType, buffer) {
  var typedArray = null;

  switch (jsType) {
    case IntTypes.UInt8:
      {
        typedArray = new Uint8Array(buffer);
        break;
      }

    case IntTypes.Int8:
      {
        typedArray = new Int8Array(buffer);
        break;
      }

    case IntTypes.UInt16:
      {
        typedArray = new Uint16Array(buffer);
        break;
      }

    case IntTypes.Int16:
      {
        typedArray = new Int16Array(buffer);
        break;
      }

    case IntTypes.UInt32:
      {
        typedArray = new Uint32Array(buffer);
        break;
      }

    case IntTypes.Int32:
      {
        typedArray = new Int32Array(buffer);
        break;
      }

    case IntTypes.UInt64:
      {
        throw new BigUint64Array(buffer);
      }

    case IntTypes.Int64:
      {
        throw new BigInt64Array(buffer);
      }

    case FloatTypes.Float32:
      {
        typedArray = new Float32Array(buffer);
        break;
      }

    case FloatTypes.Float64:
      {
        typedArray = new Float64Array(buffer);
        break;
      }

    case 'null':
      {
        typedArray = null;
        break;
      }

    case null:
      {
        typedArray = null;
        break;
      }

    default:
      throw new Error('Type is not supported as a TypedArray');
  }

  return typedArray;
};

module.exports = bufferToTypedArray;

},{"./FloatTypes.js":8,"./IntTypes.js":10}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var haveSharedArrayBuffer = typeof self.SharedArrayBuffer === 'function'; // eslint-disable-line

function getTransferable(data) {
  var result = null;

  if (data.buffer) {
    result = data.buffer;
  } else if (data.byteLength) {
    result = data;
  }

  if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) {
    // eslint-disable-line
    result = null;
  }

  return result;
}

var _default = getTransferable;
exports["default"] = _default;

},{}],14:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

// Load the Emscripten module in the browser.
//
// If the browser supports WebAssembly, then use the path the the WebAssembly
// wrapper module instead.
//
// If itkModulesPath is a relative Path, then resolve assuming we were called
// from <itkModulesPath>/WebWorkers/, since modules are loaded by the web
// workers.
//
// itkModulesPath is usually taken from './itkConfig', but a different value
// could be passed.
//
// If isAbsoluteURL is `true`, then itkModulesPath is not used, and
// pipelinePath is assumed to be an absoluteURL.
//
// modulesDirectory is one of "ImageIOs", "MeshIOs", or "Pipelines"
//
// pipelinePath is the file name of the emscripten module without the ".js"
// extension
function loadEmscriptenModule(itkModulesPath, modulesDirectory, pipelinePath, isAbsoluteURL) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  var moduleScriptDir = prefix + '/' + modulesDirectory;

  if ((typeof WebAssembly === "undefined" ? "undefined" : (0, _typeof2["default"])(WebAssembly)) === 'object' && typeof WebAssembly.Memory === 'function') {
    var modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js';
    }

    importScripts(modulePath);
    var moduleBaseName = pipelinePath.replace(/.*\//, '');
    var module = self[moduleBaseName]({
      moduleScriptDir: moduleScriptDir,
      isAbsoluteURL: isAbsoluteURL,
      pipelinePath: pipelinePath
    });
    return module;
  } else {
    var _modulePath = moduleScriptDir + '/' + pipelinePath + '.js';

    if (isAbsoluteURL) {
      _modulePath = pipelinePath + '.js';
    }

    importScripts(_modulePath);
    return Module;
  }
}

var _default = loadEmscriptenModule;
exports["default"] = _default;

},{"@babel/runtime/helpers/interopRequireDefault":2,"@babel/runtime/helpers/typeof":3}],15:[function(require,module,exports){
(function (global){(function (){
"use strict";

var IOTypes = require('./IOTypes.js');

var bufferToTypedArray = require('./bufferToTypedArray.js');

var haveSharedArrayBuffer = false;

if (typeof window !== 'undefined') {
  haveSharedArrayBuffer = typeof window.SharedArrayBuffer === 'function';
} else {
  haveSharedArrayBuffer = typeof global.SharedArrayBuffer === 'function';
}

var typedArrayForBuffer = function typedArrayForBuffer(typedArrayType, buffer) {
  var TypedArrayFunction = null;

  if (typeof window !== 'undefined') {
    // browser
    TypedArrayFunction = window[typedArrayType];
  } else {
    // Node.js
    TypedArrayFunction = global[typedArrayType];
  }

  return new TypedArrayFunction(buffer);
};

var readFileSharedArray = function readFileSharedArray(emscriptenModule, path) {
  var opts = {
    flags: 'r',
    encoding: 'binary'
  };
  var stream = emscriptenModule.open(path, opts.flags);
  var stat = emscriptenModule.stat(path);
  var length = stat.size;
  var arrayBuffer = null;

  if (haveSharedArrayBuffer) {
    arrayBuffer = new SharedArrayBuffer(length); // eslint-disable-line
  } else {
    arrayBuffer = new ArrayBuffer(length);
  }

  var array = new Uint8Array(arrayBuffer);
  emscriptenModule.read(stream, array, 0, length, 0);
  emscriptenModule.close(stream);
  return array;
};

var runPipelineEmscripten = function runPipelineEmscripten(pipelineModule, args, outputs, inputs) {
  if (inputs) {
    inputs.forEach(function (input) {
      switch (input.type) {
        case IOTypes.Text:
          {
            pipelineModule.writeFile(input.path, input.data);
            break;
          }

        case IOTypes.Binary:
          {
            pipelineModule.writeFile(input.path, input.data);
            break;
          }

        case IOTypes.Image:
          {
            var imageJSON = {};

            for (var key in input.data) {
              if (Object.prototype.hasOwnProperty.call(input.data, key) && key !== 'data') {
                imageJSON[key] = input.data[key];
              }
            }

            imageJSON.data = input.path + '.data';
            pipelineModule.writeFile(input.path, JSON.stringify(imageJSON));
            pipelineModule.writeFile(imageJSON.data, new Uint8Array(input.data.data.buffer));
            break;
          }

        case IOTypes.Mesh:
          {
            var meshJSON = {};

            for (var _key in input.data) {
              if (Object.prototype.hasOwnProperty.call(input.data, _key) && _key !== 'points' && _key !== 'pointData' && _key !== 'cells' && _key !== 'cellData') {
                meshJSON[_key] = input.data[_key];
              }
            }

            meshJSON.points = input.path + '.points.data';
            meshJSON.pointData = input.path + '.pointData.data';
            meshJSON.cells = input.path + '.cells.data';
            meshJSON.cellData = input.path + '.cellData.data';
            pipelineModule.writeFile(input.path, JSON.stringify(meshJSON));

            if (meshJSON.numberOfPoints) {
              pipelineModule.writeFile(meshJSON.points, new Uint8Array(input.data.points.buffer));
            }

            if (meshJSON.numberOfPointPixels) {
              pipelineModule.writeFile(meshJSON.pointData, new Uint8Array(input.data.pointData.buffer));
            }

            if (meshJSON.numberOfCells) {
              pipelineModule.writeFile(meshJSON.cells, new Uint8Array(input.data.cells.buffer));
            }

            if (meshJSON.numberOfCellPixels) {
              pipelineModule.writeFile(meshJSON.cellData, new Uint8Array(input.data.cellData.buffer));
            }

            break;
          }

        default:
          throw Error('Unsupported input IOType');
      }
    });
  }

  pipelineModule.resetModuleStdout();
  pipelineModule.resetModuleStderr();
  pipelineModule.callMain(args);
  var stdout = pipelineModule.getModuleStdout();
  var stderr = pipelineModule.getModuleStderr();
  var populatedOutputs = [];

  if (outputs) {
    outputs.forEach(function (output) {
      var populatedOutput = {};
      Object.assign(populatedOutput, output);

      switch (output.type) {
        case IOTypes.Text:
          {
            populatedOutput.data = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            break;
          }

        case IOTypes.Binary:
          {
            populatedOutput.data = readFileSharedArray(pipelineModule, output.path);
            break;
          }

        case IOTypes.Image:
          {
            var imageJSON = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            var image = JSON.parse(imageJSON);
            var dataUint8 = readFileSharedArray(pipelineModule, image.data);
            image.data = bufferToTypedArray(image.imageType.componentType, dataUint8.buffer);
            populatedOutput.data = image;
            break;
          }

        case IOTypes.Mesh:
          {
            var meshJSON = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            var mesh = JSON.parse(meshJSON);

            if (mesh.numberOfPoints) {
              var dataUint8Points = readFileSharedArray(pipelineModule, mesh.points);
              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, dataUint8Points.buffer);
            } else {
              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfPointPixels) {
              var dataUint8PointData = readFileSharedArray(pipelineModule, mesh.pointData);
              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer);
            } else {
              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfCells) {
              var dataUint8Cells = readFileSharedArray(pipelineModule, mesh.cells);
              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, dataUint8Cells.buffer);
            } else {
              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfCellPixels) {
              var dataUint8CellData = readFileSharedArray(pipelineModule, mesh.cellData);
              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer);
            } else {
              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
            }

            populatedOutput.data = mesh;
            break;
          }

        case IOTypes.vtkPolyData:
          {
            var polyDataJSON = pipelineModule.readFile("".concat(output.path, "/index.json"), {
              encoding: 'utf8'
            });
            var polyData = JSON.parse(polyDataJSON);
            var cellTypes = ['points', 'verts', 'lines', 'polys', 'strips'];
            cellTypes.forEach(function (cellName) {
              if (polyData[cellName]) {
                var cell = polyData[cellName];

                if (cell.ref) {
                  var _dataUint = readFileSharedArray(pipelineModule, "".concat(output.path, "/").concat(cell.ref.basepath, "/").concat(cell.ref.id));

                  polyData[cellName].buffer = _dataUint.buffer;
                  polyData[cellName].values = typedArrayForBuffer(polyData[cellName].dataType, _dataUint.buffer);
                  delete cell.ref;
                }
              }
            });
            var dataSetType = ['pointData', 'cellData', 'fieldData'];
            dataSetType.forEach(function (dataName) {
              if (polyData[dataName]) {
                var data = polyData[dataName];
                data.arrays.forEach(function (array) {
                  if (array.data.ref) {
                    var _dataUint2 = readFileSharedArray(pipelineModule, "".concat(output.path, "/").concat(array.data.ref.basepath, "/").concat(array.data.ref.id));

                    array.data.buffer = _dataUint2.buffer;
                    array.data.values = typedArrayForBuffer(array.data.dataType, _dataUint2.buffer);
                    delete array.data.ref;
                  }
                });
              }
            });
            populatedOutput.data = polyData;
            break;
          }

        default:
          throw Error('Unsupported output IOType');
      }

      populatedOutputs.push(populatedOutput);
    });
  }

  return {
    stdout: stdout,
    stderr: stderr,
    outputs: populatedOutputs
  };
};

module.exports = runPipelineEmscripten;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./IOTypes.js":9,"./bufferToTypedArray.js":12}]},{},[11]);
