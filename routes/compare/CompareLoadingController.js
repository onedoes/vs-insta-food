System.register([], function (_export) {
  /**
   * @ngInject
   */
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  _export('default', CompareLoadingController);

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
      $state.go('compare.action', lrImageIds, { location: 'replace' });
    }
  }

  return {
    setters: [],
    execute: function () {}
  };
});