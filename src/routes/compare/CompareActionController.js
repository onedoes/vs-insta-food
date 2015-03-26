//

import {
  MAX_COMPARE_ACION_TIME,
  MAX_COMPARE_SCORE,
  MEDIAS_REF
  } from 'services/constants';

const INITIAL_SCORE_VALUE = Math.floor(MAX_COMPARE_SCORE / 2);

export default function CompareActionController($q, $scope, $state, imagesToCompareStorage, resolvedLeftImage, resolvedRightImage) {
  this.hasVoted = false;
  this.leftImage = resolvedLeftImage;
  this.rightImage = resolvedRightImage;
  this.decompte = MAX_COMPARE_ACION_TIME;
  this.score = INITIAL_SCORE_VALUE;

  this.nextComparison = nextComparison;

  ////

  function nextComparison() {
    if (this.hasVoted){ return; }

    this.hasVoted = true;

    saveScore([this.leftImage, this.rightImage], this.score);

    let [leftId, rightId] = imagesToCompareStorage.nextPair();
    $state.go('compare.action', {
      leftId, rightId
    }, {
      location: 'replace'
    });
  }

  function goToTrending() {
    saveScore([this.leftImage, this.rightImage], this.score);
    $state.go('trending');
  }

  function saveScore([left, right], level) {
    let [leftScore, rightScore] = calculateLeftRightScore(+level);
    return $q.all([
      saveMediaAndScore(left, leftScore),
      saveMediaAndScore(right, rightScore)
    ]);
  }

  function calculateLeftRightScore(level) {
    return [INITIAL_SCORE_VALUE - level, level - INITIAL_SCORE_VALUE];
  }

  function saveMediaAndScore(media, score) {

    return $q
      .when(MEDIAS_REF.child(media.id))
      .then(function isExistingRef(ref) {
        return $q((resolve, reject) => {
          ref.once('value', (snapshot) => {
            snapshot.val() ? resolve(ref) : reject(ref);
          });
        });
      })
      .then(function transactionOnScore(ref) {
        ref
          .child('score')
          .transaction((current_value) => (current_value || 0) + score);
      })
      .catch(function create(ref) {
        ref.set(_.assign({}, media, { score }));
      })

  }

  ////

  // TODO(douglasduteil): [SMELLY CODE] Clean this plz
  let lastTime, now;
  let time = 0;
  lastTime = window.performance.now();
  (function _decrease() {
    if (this.hasVoted ) {
      return;
    }
    else if (this.decompte > 0) {
      window.requestAnimationFrame(_decrease.bind(this));
    }
    else {
      goToTrending.call(this);
    }

    now = window.performance.now();
    time += Math.min(1, (now - lastTime) / 1000);
    $scope.$evalAsync(() => this.decompte = Math.floor(MAX_COMPARE_ACION_TIME - time));
    lastTime = now;
  }.call(this));
}

CompareActionController.nameAs = 'compareActionCtrl';

CompareActionController.resolve = {
  resolvedLeftImage: function ($q, $stateParams, imagesToCompareStorage) {
    return resolveOrReturnHome($q, imagesToCompareStorage.storage[$stateParams.leftId]);
  },
  _leftImageLoaded: function($q, resolvedLeftImage){
    return $q((resolve, reject) => {
      var img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = resolvedLeftImage.images.low_resolution.url;
    })
  },
  resolvedRightImage: function ($q, $stateParams, imagesToCompareStorage) {
    return resolveOrReturnHome($q, imagesToCompareStorage.storage[$stateParams.rightId]);
  },
  _rightImageLoaded: function($q, resolvedRightImage){
    return $q((resolve, reject) => {
      var img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = resolvedRightImage.images.low_resolution.url;
    })
  }
};

////

function resolveOrReturnHome($q, val) {
  return $q[!!val ? 'when' : 'reject'](val)
    .catch(() => $q.reject({ redirectTo: 'trending' }))
}
