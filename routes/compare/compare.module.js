System.register(["angular", "angular-ui-router", "lodash", "services/constants", "services/ImagesToCompareStorage.module", "./CompareActionController", "./CompareLoadingController", "./compareAction.html!text", "./compareLoading.html!text"], function (_export) {
  var angular, uiRouter, _, MEDIAS_REF, ImagesToCompareStorageModule, CompareActionController, CompareLoadingController, compareActionHtmlTemplate, compareLoadingHtmlTemplate;

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
  return {
    setters: [function (_angular) {
      angular = _angular["default"];
    }, function (_angularUiRouter) {
      uiRouter = _angularUiRouter["default"];
    }, function (_lodash) {
      _ = _lodash["default"];
    }, function (_servicesConstants) {
      MEDIAS_REF = _servicesConstants.MEDIAS_REF;
    }, function (_servicesImagesToCompareStorageModule) {
      ImagesToCompareStorageModule = _servicesImagesToCompareStorageModule["default"];
    }, function (_CompareActionController) {
      CompareActionController = _CompareActionController["default"];
    }, function (_CompareLoadingController) {
      CompareLoadingController = _CompareLoadingController["default"];
    }, function (_compareActionHtmlText) {
      compareActionHtmlTemplate = _compareActionHtmlText["default"];
    }, function (_compareLoadingHtmlText) {
      compareLoadingHtmlTemplate = _compareLoadingHtmlText["default"];
    }],
    execute: function () {
      //

      "use strict";

      ////

      _export("default", angular.module("odif.compare", [ImagesToCompareStorageModule.name, "ui.router"]).config(odifCompareConfig));
    }
  };
});