System.register(["angular", "angular-ui-router", "moment", "lodash", "services/constants", "services/MediaStorage.module", "./trending.html!text"], function (_export) {
  var angular, uiRouter, moment, _, MEDIAS_REF, MediaStorageModule, trendingHtmlTemplate, MOMENT_STARTING_HOUR, MOMENT_ENDING_HOUR, MIDNIGHT_MOMENT_DATA, MOMENT_NOW_BASED, MOMENT_START_DATE, MOMENT_END_DATE, TRENDING_STATUS;

  ////

  function trendingRoutesConfig($stateProvider) {

    $stateProvider.state("trending", {
      url: "/",
      controller: TrendingController,
      controllerAs: TrendingController.nameAs,
      template: trendingHtmlTemplate
    });
  }

  function TrendingController($interval, $state, $http, mediaStorage) {

    this.TRENDING_STATUS = TRENDING_STATUS;

    this.mediaStorage = mediaStorage;
    this.gotTocompare = gotTocompare;
    this.getItemClassRank = getItemClassRank;
    this.init = init;
    this.reserve = reserve;

    ////

    function init() {
      var now = new Date();
      var startTimeDiff = MOMENT_START_DATE - now;

      this.status = _getNewStatus();

      $interval(_.bind(_countDownTimerLoop, this), 1000);
    }

    function _countDownTimerLoop() {
      this.remainingTime = moment(MOMENT_START_DATE).subtract(moment()).format("HH:mm:ss");

      this.status = _getNewStatus(this.remainingTime);
    }

    function _getNewStatus() {
      var now = moment();
      if (moment.min(now, MOMENT_START_DATE) === now) {
        return TRENDING_STATUS.WAITING_TIME;
      }

      return TRENDING_STATUS.MOMENT_TIME;
    }

    function gotTocompare() {
      $state.go("compare.loading");
    }

    function getItemClassRank(index) {
      var ranks = arguments[1] === undefined ? [""] : arguments[1];

      var rankClass = ranks[index];
      return rankClass || ranks[ranks.length - 1];
    }

    function reserve(media) {
      MEDIAS_REF.child(media.id).remove(function () {
        _sendMeetupCommentAboutEatingThisForDinner(media);
        mediaStorage.bestMediaToSend = null;
      });
    }

    function _sendMeetupCommentAboutEatingThisForDinner(media) {
      $http.post("https://choasrating-doogd.c9.io/comment", {
        link: media.link
      }).then(function (res) {
        return console.log("Chaos comment posted", res);
      })["catch"](function (e) {
        return console.error("Chaos comment lost...", e);
      });
    }
  }
  return {
    setters: [function (_angular) {
      angular = _angular["default"];
    }, function (_angularUiRouter) {
      uiRouter = _angularUiRouter["default"];
    }, function (_moment) {
      moment = _moment["default"];
    }, function (_lodash) {
      _ = _lodash["default"];
    }, function (_servicesConstants) {
      MEDIAS_REF = _servicesConstants.MEDIAS_REF;
    }, function (_servicesMediaStorageModule) {
      MediaStorageModule = _servicesMediaStorageModule["default"];
    }, function (_trendingHtmlText) {
      trendingHtmlTemplate = _trendingHtmlText["default"];
    }],
    execute: function () {
      //

      "use strict";

      MOMENT_STARTING_HOUR = 21;
      MOMENT_ENDING_HOUR = 23;
      MIDNIGHT_MOMENT_DATA = {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      };
      MOMENT_NOW_BASED = moment();

      if (MOMENT_NOW_BASED.hour() > MOMENT_ENDING_HOUR) {
        MOMENT_NOW_BASED.add(1, "d");
      }
      MOMENT_START_DATE = moment(MOMENT_NOW_BASED).set(_.assign({}, MIDNIGHT_MOMENT_DATA, { hour: MOMENT_STARTING_HOUR }));
      MOMENT_END_DATE = moment(MOMENT_NOW_BASED).set(_.assign({}, MIDNIGHT_MOMENT_DATA, { hour: MOMENT_ENDING_HOUR }));
      TRENDING_STATUS = {
        WAITING_TIME: "WAITING_TIME",
        MOMENT_TIME: "MOMENT_TIME",
        SPAMMING_TIME: "SPAMMING_TIME"
      };

      ////

      _export("default", angular.module("odif.trending", [MediaStorageModule.name, "ui.router"]).config(trendingRoutesConfig));

      TrendingController.nameAs = "trendingCtrl";
    }
  };
});

//

//