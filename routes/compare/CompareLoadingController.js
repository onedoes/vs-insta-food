System.register([], function (_export) {
  var _slicedToArray;

  /**
   * @ngInject
   */

  _export("default", CompareLoadingController);

  function CompareLoadingController($state, $q, $timeout, imagesToCompareStorage) {

    return $q.all([timeoutPromise(2000), resolveStorage()]).then(extractFirstMediaPair).then(letsGetToActions);

    ////

    // TODO(douglasduteil): Move it to global utils functions
    function timeoutPromise() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return $q(function (resolve) {
        return $timeout.apply(undefined, [resolve].concat(args));
      });
    }

    function resolveStorage() {
      return imagesToCompareStorage.initNewStore();
    }

    function extractFirstMediaPair() {
      var _imagesToCompareStorage$nextPair = imagesToCompareStorage.nextPair();

      var _imagesToCompareStorage$nextPair2 = _slicedToArray(_imagesToCompareStorage$nextPair, 2);

      var leftId = _imagesToCompareStorage$nextPair2[0];
      var rightId = _imagesToCompareStorage$nextPair2[1];

      return { leftId: leftId, rightId: rightId };
    }

    function letsGetToActions(lrImageIds) {
      $state.go("compare.action", lrImageIds, { location: "replace" });
    }
  }

  return {
    setters: [],
    execute: function () {
      "use strict";

      _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };
    }
  };
});