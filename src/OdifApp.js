import angular from 'angular';
import uiRouter from 'angular-ui-router';

import compareRouteModule from 'routes/compare/compare.module';
import trendingRouteModule from 'routes/trending/trending.module';

////

export default angular
  .module('OdifApp', [
    compareRouteModule.name,
    trendingRouteModule.name,
    'ui.router'
  ])
  .run(odifAppRouteRun)
  .config(odifAppRoutesConfig)
  ;

////

function odifAppRoutesConfig($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');
}

function odifAppRouteRun($rootScope, $state, $log) {
  $rootScope.version = '1.0.0-beta';

  $rootScope.$on('$stateChangeError', stateChangeErrorCallback);

  //

  function stateChangeErrorCallback(event, toState, toParams, fromState, fromParams, error) {

    $log.error('Undefined error from "' + (fromState && fromState.name) + '" to "' + (toState && toState.name) + '"\nError : ', error);

    if (error && error.redirectTo) {
      $state.go(error.redirectTo);
    }

  }
}
