System.register(['services/constants'], function (_export) {
  //

  'use strict';

  var MAX_COMPARE_ACION_TIME, MAX_COMPARE_SCORE, MEDIAS_REF, INITIAL_SCORE_VALUE;

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  _export('default', CompareActionController);

  function CompareActionController($q, $scope, $state, imagesToCompareStorage, resolvedLeftImage, resolvedRightImage) {
    this.hasVoted = false;
    this.leftImage = resolvedLeftImage;
    this.rightImage = resolvedRightImage;
    this.decompte = MAX_COMPARE_ACION_TIME;
    this.score = INITIAL_SCORE_VALUE;

    this.nextComparison = nextComparison;

    ////

    function nextComparison() {
      if (this.hasVoted) {
        return;
      }

      this.hasVoted = true;

      saveScore([this.leftImage, this.rightImage], this.score);

      var _imagesToCompareStorage$nextPair = imagesToCompareStorage.nextPair();

      var _imagesToCompareStorage$nextPair2 = _slicedToArray(_imagesToCompareStorage$nextPair, 2);

      var leftId = _imagesToCompareStorage$nextPair2[0];
      var rightId = _imagesToCompareStorage$nextPair2[1];

      $state.go('compare.action', {
        leftId: leftId, rightId: rightId
      }, {
        location: 'replace'
      });
    }

    function goToTrending() {
      saveScore([this.leftImage, this.rightImage], this.score);
      $state.go('trending');
    }

    function saveScore(_ref, level) {
      var _ref2 = _slicedToArray(_ref, 2);

      var left = _ref2[0];
      var right = _ref2[1];

      var _calculateLeftRightScore = calculateLeftRightScore(+level);

      var _calculateLeftRightScore2 = _slicedToArray(_calculateLeftRightScore, 2);

      var leftScore = _calculateLeftRightScore2[0];
      var rightScore = _calculateLeftRightScore2[1];

      return $q.all([saveMediaAndScore(left, leftScore), saveMediaAndScore(right, rightScore)]);
    }

    function calculateLeftRightScore(level) {
      return [INITIAL_SCORE_VALUE - level, level - INITIAL_SCORE_VALUE];
    }

    function saveMediaAndScore(media, score) {

      return $q.when(MEDIAS_REF.child(media.id)).then(function isExistingRef(ref) {
        return $q(function (resolve, reject) {
          ref.once('value', function (snapshot) {
            snapshot.val() ? resolve(ref) : reject(ref);
          });
        });
      }).then(function transactionOnScore(ref) {
        ref.child('score').transaction(function (current_value) {
          return (current_value || 0) + score;
        });
      })['catch'](function create(ref) {
        ref.set(_.assign({}, media, { score: score }));
      });
    }

    ////

    // TODO(douglasduteil): [SMELLY CODE] Clean this plz
    var lastTime = undefined,
        now = undefined;
    var time = 0;
    lastTime = window.performance.now();
    (function _decrease() {
      var _this = this;

      if (this.hasVoted) {
        return;
      } else if (this.decompte > 0) {
        window.requestAnimationFrame(_decrease.bind(this));
      } else {
        goToTrending.call(this);
      }

      now = window.performance.now();
      time += Math.min(1, (now - lastTime) / 1000);
      $scope.$evalAsync(function () {
        return _this.decompte = Math.floor(MAX_COMPARE_ACION_TIME - time);
      });
      lastTime = now;
    }).call(this);
  }

  ////

  function resolveOrReturnHome($q, val) {
    return $q[!!val ? 'when' : 'reject'](val)['catch'](function () {
      return $q.reject({ redirectTo: 'trending' });
    });
  }
  return {
    setters: [function (_servicesConstants) {
      MAX_COMPARE_ACION_TIME = _servicesConstants.MAX_COMPARE_ACION_TIME;
      MAX_COMPARE_SCORE = _servicesConstants.MAX_COMPARE_SCORE;
      MEDIAS_REF = _servicesConstants.MEDIAS_REF;
    }],
    execute: function () {
      INITIAL_SCORE_VALUE = Math.floor(MAX_COMPARE_SCORE / 2);

      CompareActionController.nameAs = 'compareActionCtrl';

      CompareActionController.resolve = {
        resolvedLeftImage: function resolvedLeftImage($q, $stateParams, imagesToCompareStorage) {
          return resolveOrReturnHome($q, imagesToCompareStorage.storage[$stateParams.leftId]);
        },
        _leftImageLoaded: function _leftImageLoaded($q, resolvedLeftImage) {
          return $q(function (resolve, reject) {
            var img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = resolvedLeftImage.images.low_resolution.url;
          });
        },
        resolvedRightImage: function resolvedRightImage($q, $stateParams, imagesToCompareStorage) {
          return resolveOrReturnHome($q, imagesToCompareStorage.storage[$stateParams.rightId]);
        },
        _rightImageLoaded: function _rightImageLoaded($q, resolvedRightImage) {
          return $q(function (resolve, reject) {
            var img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = resolvedRightImage.images.low_resolution.url;
          });
        }
      };
    }
  };
});