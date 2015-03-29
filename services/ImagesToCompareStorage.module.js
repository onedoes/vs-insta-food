System.register(["angular", "lodash", "services/MediaStorage.module", "services/constants"], function (_export) {
  var angular, _, MediaStorageModule, MAX_MEDIA_COUNT, INSTAGRAM_TAG, INSTAGRAM_ENDPOINT, INSTAGRAM_CLIENT_ID, INSTAGRAM_LIMIT_COUNT, INSTAGRAM_URL, TRASH_TAGS;

  ////

  function ImagesToCompareStorage($http, mediaStorage) {

    var next = "";
    var iteration = 0;
    this.pictures = [];

    this.storage = [];
    this.comparingPairs = [];
    this.currentPairIndex = 0;

    this.initNewStore = initNewStore;
    this.resetWith = resetWith;
    this.nextPair = nextPair;

    ////

    function initNewStore() {
      return get50Pictures.call(this, mediaStorage.items).then(function (pictures) {
        return pictures;
      }).then(resetWith.bind(this));
    }

    function nextPair() {
      return this.comparingPairs[this.currentPairIndex++] || [];
    }

    function resetWith(pictures) {
      this.currentPairIndex = 0;

      this.storage = _.indexBy(pictures, "id");

      var lastId = undefined;
      this.comparingPairs = _(this.storage).keys().shuffle().reduce(function (pairs, id) {

        if (!lastId) {
          lastId = id;
          return pairs;
        }

        pairs.push([lastId, id]);
        lastId = null;
        return pairs;
      }, []);
    }

    function get50Pictures() {
      var lastPictures = arguments[0] === undefined ? [] : arguments[0];

      return getInstagramPhotos().then(function (newPictures) {
        ++iteration;
        return _(lastPictures).concat(newPictures).uniq("id").value();
      });
    }

    function getInstagramPhotos() {
      var url = INSTAGRAM_URL;

      if (next.length) {
        // TODO(douglasduteil): Recursive promise call
        url += "&min_tag_id=" + next;
      }

      return $http.jsonp(INSTAGRAM_URL).then(function (res) {
        // TODO(douglasduteil): Recursive promise call
        // next = res.data.pagination.next_max_tag_id;
        return _(res.data.data).filter(function (pic) {
          return _.includes(pic.tags, INSTAGRAM_TAG);
        }).filter(function (pic) {
          return !_.intersection(pic.tags, TRASH_TAGS).length;
        }).map(function (pic) {
          pic.date = new Date(parseInt(pic.created_time) * 1000);
          pic.images.low_resolution.url = pic.images.low_resolution.url.replace("http://", "https://");
          return pic;
        }).value();
      });
    }
  }
  return {
    setters: [function (_angular) {
      angular = _angular["default"];
    }, function (_lodash) {
      _ = _lodash["default"];
    }, function (_servicesMediaStorageModule) {
      MediaStorageModule = _servicesMediaStorageModule["default"];
    }, function (_servicesConstants) {
      MAX_MEDIA_COUNT = _servicesConstants.MAX_MEDIA_COUNT;
    }],
    execute: function () {
      //

      "use strict";

      _export("default", angular.module("odif.imagesToCompareStorage", [MediaStorageModule.name]).service("imagesToCompareStorage", ImagesToCompareStorage));

      ////

      INSTAGRAM_TAG = "foodporn";
      INSTAGRAM_ENDPOINT = "tags/" + INSTAGRAM_TAG + "/media/recent";
      INSTAGRAM_CLIENT_ID = "467ede5a6b9b48ae8e03f4e2582aeeb3";
      INSTAGRAM_LIMIT_COUNT = MAX_MEDIA_COUNT;
      INSTAGRAM_URL = "https://api.instagram.com/v1/" + INSTAGRAM_ENDPOINT + "?client_id=" + INSTAGRAM_CLIENT_ID + "&count=" + INSTAGRAM_LIMIT_COUNT + "&callback=JSON_CALLBACK";
      TRASH_TAGS = ["1000likes", "abs", "beautiful", "bug", "cute", "fashion", "fit", "fitness", "fitnessaddict", "followback", "followforfollow", "followme", "gym", "iloveher", "imissyou", "instacool", "instagood", "instalike", "instafollow", "like4like", "likeforlike", "likemyphoto", "lover", "mustfollow", "snapchat", "tags4tags", "tagsforlikes", "teamfollowback", "vscocam", "vscogram"];
    }
  };
});