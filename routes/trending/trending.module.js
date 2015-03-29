System.register(["angular", "angular-ui-router", "lodash", "services/MediaStorage.module", "./trending.html!text"], function (_export) {
  var angular, uiRouter, _, MediaStorageModule, trendingHtmlTemplate;

  ////

  function trendingRoutesConfig($stateProvider) {

    $stateProvider.state("trending", {
      url: "/",
      controller: TrendingController,
      controllerAs: TrendingController.nameAs,
      template: trendingHtmlTemplate
    });
  }

  function TrendingController($state, mediaStorage) {

    this.mediaStorage = mediaStorage;
    this.gotTocompare = gotTocompare;
    this.getItemClassRank = getItemClassRank;

    ////

    function gotTocompare() {
      $state.go("compare.loading");
    }

    function getItemClassRank(index) {
      var ranks = arguments[1] === undefined ? [""] : arguments[1];

      var rankClass = ranks[index];
      return rankClass || ranks[ranks.length - 1];
    }
  }
  return {
    setters: [function (_angular) {
      angular = _angular["default"];
    }, function (_angularUiRouter) {
      uiRouter = _angularUiRouter["default"];
    }, function (_lodash) {
      _ = _lodash["default"];
    }, function (_servicesMediaStorageModule) {
      MediaStorageModule = _servicesMediaStorageModule["default"];
    }, function (_trendingHtmlText) {
      trendingHtmlTemplate = _trendingHtmlText["default"];
    }],
    execute: function () {
      //

      "use strict";

      ////

      _export("default", angular.module("odif.trending", [MediaStorageModule.name, "ui.router"]).config(trendingRoutesConfig));

      TrendingController.nameAs = "trendingCtrl";
    }
  };
});

//