System.register(["angular", "lodash", "services/constants"], function (_export) {
  var angular, _, DEBOUNCE_CACHE_POSTING_DURATION, MEDIAS_REF, FIREBASE_CONNECTION_REF, MAX_MEDIA_COUNT;

  ////

  function MediaStorage($http, $rootScope) {
    var _this = this;

    // TODO(douglasduteil): use minimal empty space
    // Array.from({ length: 5 }, (_, id) => Object.create({ id: id }));
    this.items = [];

    // Disconnection management
    // TODO(douglasduteil): find a better way to deal with reconnection
    // Case : Offline +> Online
    // Case : Online  +> Offline +> Online
    FIREBASE_CONNECTION_REF.on("value", _.debounce(function (snap) {
      return snap.val() && Firebase.goOnline();
    }, DEBOUNCE_CACHE_POSTING_DURATION));

    // Fresh
    MEDIAS_REF.orderByChild("score").on("value", _.debounce(_updateTrendingList, DEBOUNCE_CACHE_POSTING_DURATION), this);

    // Warm
    $http.get("/cache/medias").then(function (res) {
      return _this.items = res.data;
    });

    function _updateTrendingList(snapshot) {
      var _this2 = this;

      var items = _(snapshot.val()).sortBy("score").reverse().take(MAX_MEDIA_COUNT).value();

      $http.post("/cache/medias", items);

      $rootScope.$evalAsync(function () {
        return _this2.items = items;
      });

      //

      this.bestMediaToSend = items[0] && items[0].score > 400 && items[0];

      //

      var mediaToCountDrop = snapshot.numChildren() - MAX_MEDIA_COUNT * 2;
      if (mediaToCountDrop > 0) {
        snapshot.ref().orderByChild("score").limitToFirst(mediaToCountDrop).once("value", function (snap) {
          _.map(snap.val(), function (media, id) {
            return snap.ref().child(id).remove();
          });
        });
      }
    }
  }
  return {
    setters: [function (_angular) {
      angular = _angular["default"];
    }, function (_lodash) {
      _ = _lodash["default"];
    }, function (_servicesConstants) {
      DEBOUNCE_CACHE_POSTING_DURATION = _servicesConstants.DEBOUNCE_CACHE_POSTING_DURATION;
      MEDIAS_REF = _servicesConstants.MEDIAS_REF;
      FIREBASE_CONNECTION_REF = _servicesConstants.FIREBASE_CONNECTION_REF;
      MAX_MEDIA_COUNT = _servicesConstants.MAX_MEDIA_COUNT;
    }],
    execute: function () {
      //

      "use strict";

      _export("default", angular.module("odif." + MediaStorage.name, []).service("mediaStorage", MediaStorage));
    }
  };
});