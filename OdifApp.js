System.register(["angular", "angular-ui-router", "routes/compare/compare.module", "routes/trending/trending.module"], function (_export) {
  var angular, uiRouter, compareRouteModule, trendingRouteModule;

  ////

  function odifAppRoutesConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
  }

  function odifAppRouteRun($rootScope, $state, $log) {
    $rootScope.version = "1.0.0-beta";

    $rootScope.$on("$stateChangeError", stateChangeErrorCallback);

    //

    function stateChangeErrorCallback(event, toState, toParams, fromState, fromParams, error) {

      $log.error("Undefined error from \"" + (fromState && fromState.name) + "\" to \"" + (toState && toState.name) + "\"\nError : ", error);

      if (error && error.redirectTo) {
        $state.go(error.redirectTo);
      }
    }
  }
  return {
    setters: [function (_angular) {
      angular = _angular["default"];
    }, function (_angularUiRouter) {
      uiRouter = _angularUiRouter["default"];
    }, function (_routesCompareCompareModule) {
      compareRouteModule = _routesCompareCompareModule["default"];
    }, function (_routesTrendingTrendingModule) {
      trendingRouteModule = _routesTrendingTrendingModule["default"];
    }],
    execute: function () {
      "use strict";

      ////

      _export("default", angular.module("OdifApp", [compareRouteModule.name, trendingRouteModule.name, "ui.router"]).run(odifAppRouteRun).config(odifAppRoutesConfig));
    }
  };
});