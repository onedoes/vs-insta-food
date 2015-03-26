"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var uiRouter = _interopRequire(require("angular-ui-router"));

var _ = _interopRequire(require("lodash"));

var MEDIAS_REF = require("services/constants").MEDIAS_REF;

var ImagesToCompareStorageModule = _interopRequire(require("services/ImagesToCompareStorage.module"));

var CompareActionController = _interopRequire(require("./CompareActionController"));

var CompareLoadingController = _interopRequire(require("./CompareLoadingController"));

var compareActionHtmlTemplate = _interopRequire(require("./compareAction.html!text"));

var compareLoadingHtmlTemplate = _interopRequire(require("./compareLoading.html!text"));

////

module.exports = angular.module("odif.compare", [ImagesToCompareStorageModule.name, "ui.router"]).config(odifCompareConfig);

///

function odifCompareConfig($stateProvider) {
  $stateProvider.state("compare", {
    abstract: true,
    url: "/compare",
    template: "<ui-view></ui-view>"
  });

  $stateProvider.state("compare.loading", {
    url: "/loading",
    template: compareLoadingHtmlTemplate,
    controller: CompareLoadingController
  });

  $stateProvider.state("compare.action", {
    url: "/:leftId...:rightId",
    template: compareActionHtmlTemplate,
    controller: CompareActionController,
    controllerAs: CompareActionController.nameAs,
    resolve: CompareActionController.resolve
  });
}