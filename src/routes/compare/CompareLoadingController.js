
/**
 * @ngInject
 */
export default function CompareLoadingController($state, $q, $timeout, imagesToCompareStorage) {

  return $q.all([
    timeoutPromise(2000),
    resolveStorage()
  ])
    .then(extractFirstMediaPair)
    .then(letsGetToActions);

  ////


  // TODO(douglasduteil): Move it to global utils functions
  function timeoutPromise(...args) {
    return $q((resolve) => $timeout(resolve, ...args));
  }

  function resolveStorage() {
    return imagesToCompareStorage
      .initNewStore()
  }

  function extractFirstMediaPair() {
    let [leftId, rightId] = imagesToCompareStorage.nextPair();
    return { leftId, rightId };
  }

  function letsGetToActions(lrImageIds) {
    $state.go('compare.action', lrImageIds, { location: 'replace' });
  }

}
