// Generated by CoffeeScript 1.7.1
(function() {
  var Bacon, init,
    __slice = [].slice;

  init = function(Bacon) {
    var addClauseMatchers, addMatchers, addPositiveMatchers, asMatchers, contains, toFieldExtractor, toSimpleExtractor;
    toFieldExtractor = function(f) {
      var partFuncs, parts;
      parts = f.slice(1).split(".");
      partFuncs = Bacon._.map(toSimpleExtractor, parts);
      return function(value) {
        var _i, _len;
        for (_i = 0, _len = partFuncs.length; _i < _len; _i++) {
          f = partFuncs[_i];
          value = f(value);
        }
        return value;
      };
    };
    toSimpleExtractor = function(key) {
      return function(value) {
        if (value == null) {
          return void 0;
        } else {
          return value[key];
        }
      };
    };
    contains = function(container, item) {
      var containerHasAllKeyValuesOfItem, itemIsNotEmpty, matchingKeyValuePairs;
      if (container instanceof Array || typeof container === 'string') {
        return container.indexOf(item) >= 0;
      } else if (typeof container === 'object') {
        matchingKeyValuePairs = 0;
        Object.keys(item).forEach(function(bKey) {
          var containerHasItemKeyAndValue;
          containerHasItemKeyAndValue = container.hasOwnProperty(bKey) && container[bKey] === item[bKey];
          if (containerHasItemKeyAndValue) {
            return matchingKeyValuePairs += 1;
          }
        });
        containerHasAllKeyValuesOfItem = matchingKeyValuePairs === Object.keys(item).length;
        itemIsNotEmpty = Object.keys(item).length > 0;
        return containerHasAllKeyValuesOfItem && itemIsNotEmpty;
      } else {
        return false;
      }
    };
    addMatchers = function(apply1, apply2, apply3, stream, operation) {
      var context;
      context = {};
      addPositiveMatchers(context, apply1, apply2, apply3);
      addClauseMatchers(context, stream, operation, function(s) {
        return s;
      });
      context["not"] = function() {
        var applyNot1, applyNot2, applyNot3, negatedContext;
        negatedContext = {};
        applyNot1 = function(f) {
          return apply1(function(a) {
            return !f(a);
          });
        };
        applyNot2 = function(f) {
          return apply2(function(a, b) {
            return !f(a, b);
          });
        };
        applyNot3 = function(f) {
          return apply3(function(val, a, b) {
            return !f(val, a, b);
          });
        };
        addPositiveMatchers(negatedContext, applyNot1, applyNot2, applyNot3);
        return addClauseMatchers(negatedContext, stream, function(s) {
          return operation(s.not());
        });
      };
      return context;
    };
    addClauseMatchers = function(context, stream, operation) {
      context["some"] = function() {
        var fs, isSome, matches;
        fs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        matches = Bacon._.map((function(f) {
          return f(stream);
        }), fs);
        isSome = Bacon._.fold(matches, Bacon.constant(false), function(x, y) {
          return x.or(y);
        });
        return operation(isSome);
      };
      context["every"] = function() {
        var fs, isEvery, matches;
        fs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        matches = Bacon._.map((function(f) {
          return f(stream);
        }), fs);
        isEvery = Bacon._.fold(matches, Bacon.constant(true), function(x, y) {
          return x.and(y);
        });
        return operation(isEvery);
      };
      return context;
    };
    addPositiveMatchers = function(context, apply1, apply2, apply3) {
      context["lessThan"] = apply2(function(a, b) {
        return a < b;
      });
      context["lessThanOrEqualTo"] = apply2(function(a, b) {
        return a <= b;
      });
      context["greaterThan"] = apply2(function(a, b) {
        return a > b;
      });
      context["greaterThanOrEqualTo"] = apply2(function(a, b) {
        return a >= b;
      });
      context["equalTo"] = apply2(function(a, b) {
        return a === b;
      });
      context["truthy"] = apply1(function(a) {
        return !!a;
      });
      context["match"] = apply2(function(val, pattern) {
        return pattern.test(val);
      });
      context["inOpenRange"] = apply3(function(val, a, b) {
        return (a < val && val < b);
      });
      context["inClosedRange"] = apply3(function(val, a, b) {
        return (a <= val && val <= b);
      });
      context["containerOf"] = apply2(function(a, b) {
        return contains(a, b);
      });
      context["memberOf"] = apply2(function(a, b) {
        return contains(b, a);
      });
      return context;
    };
    asMatchers = function(stream, operation, combinator, fieldKey) {
      var apply1, apply2, apply3, field;
      field = fieldKey != null ? toFieldExtractor(fieldKey) : Bacon._.id;
      apply1 = function(f) {
        return function() {
          return operation(function(val) {
            return f(field(val));
          });
        };
      };
      apply2 = function(f) {
        return function(other) {
          if (other instanceof Bacon.Observable) {
            return combinator(other, function(val, other) {
              return f(field(val), other);
            });
          } else {
            return operation(function(val) {
              return f(field(val), other);
            });
          }
        };
      };
      apply3 = function(f) {
        return function(first, second) {
          return operation(function(val) {
            return f(field(val), first, second);
          });
        };
      };
      return addMatchers(apply1, apply2, apply3, stream.map(field), operation);
    };
    Bacon.Observable.prototype.is = function(fieldKey) {
      var combinator, context, operation;
      context = this;
      operation = function(f) {
        return context.map(f);
      };
      combinator = function(observable, f) {
        return context.combine(observable, f);
      };
      return asMatchers(context, operation, combinator, fieldKey);
    };
    Bacon.Observable.prototype.where = function(fieldKey) {
      var combinator, context, operation;
      context = this;
      operation = function(f) {
        return context.filter(f);
      };
      combinator = function(observable, f) {
        return context.filter(context.combine(observable, f));
      };
      return asMatchers(context, operation, combinator, fieldKey);
    };
    return Bacon;
  };

  if (typeof module !== "undefined" && module !== null) {
    Bacon = require("baconjs");
    module.exports = init(Bacon);
  } else {
    if (typeof require === "function") {
      define("bacon.matchers", ["bacon"], init);
    } else {
      init(this.Bacon);
    }
  }

}).call(this);
