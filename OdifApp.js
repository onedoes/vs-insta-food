"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var uiRouter = _interopRequire(require("angular-ui-router"));

var compareRouteModule = _interopRequire(require("routes/compare/compare.module"));

var trendingRouteModule = _interopRequire(require("routes/trending/trending.module"));

////

module.exports = angular.module("OdifApp", [compareRouteModule.name, trendingRouteModule.name, "ui.router"]).run(odifAppRouteRun).config(odifAppRoutesConfig);

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