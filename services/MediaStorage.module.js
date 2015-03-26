"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var _ = _interopRequire(require("lodash"));

var _servicesConstants = require("services/constants");

var MEDIAS_REF = _servicesConstants.MEDIAS_REF;
var MAX_MEDIA_COUNT = _servicesConstants.MAX_MEDIA_COUNT;
module.exports = angular.module("odif." + MediaStorage.name, []).service("mediaStorage", MediaStorage);

////

function MediaStorage($http, $rootScope) {
  var _this = this;

  // TODO(douglasduteil): use minimal empty space
  // Array.from({ length: 5 }, (_, id) => Object.create({ id: id }));
  this.items = [];

  // Fresh
  MEDIAS_REF.orderByChild("score").limitToFirst(MAX_MEDIA_COUNT).on("value", _.debounce(_updateTrendingList, 1000), this);

  // Warm
  $http.get("/cache/medias").then(function (res) {
    return _this.items = res.data;
  });

  function _updateTrendingList(snapshot) {
    var _this2 = this;

    var items = _(snapshot.val()).sortBy("score").reverse().value();

    $http.post("/cache/medias", items);

    $rootScope.$evalAsync(function () {
      return _this2.items = items;
    });

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