"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

//

var angular = _interopRequire(require("angular"));

var uiRouter = _interopRequire(require("angular-ui-router"));

var _ = _interopRequire(require("lodash"));

var MediaStorageModule = _interopRequire(require("services/MediaStorage.module"));

//

var trendingHtmlTemplate = _interopRequire(require("./trending.html!text"));

////

module.exports = angular.module("odif.trending", [MediaStorageModule.name, "ui.router"]).config(trendingRoutesConfig);

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
TrendingController.nameAs = "trendingCtrl";