System.register(["firebase"], function (_export) {
  var Firebase, FIREBASE_BASE_URL, MEDIAS_REF, FIREBASE_CONNECTION_REF, MAX_MEDIA_COUNT, DEBOUNCE_CACHE_POSTING_DURATION, MAX_COMPARE_ACION_TIME, MAX_COMPARE_SCORE;
  return {
    setters: [function (_firebase) {
      Firebase = _firebase["default"];
    }],
    execute: function () {
      "use strict";

      FIREBASE_BASE_URL = "https://onedoes-vs-instafood.firebaseio.com/";

      _export("FIREBASE_BASE_URL", FIREBASE_BASE_URL);

      MEDIAS_REF = new Firebase("" + FIREBASE_BASE_URL + "/medias");

      _export("MEDIAS_REF", MEDIAS_REF);

      FIREBASE_CONNECTION_REF = new Firebase("" + FIREBASE_BASE_URL + "/.info/connected");

      _export("FIREBASE_CONNECTION_REF", FIREBASE_CONNECTION_REF);

      MAX_MEDIA_COUNT = 12;

      _export("MAX_MEDIA_COUNT", MAX_MEDIA_COUNT);

      DEBOUNCE_CACHE_POSTING_DURATION = 500;

      _export("DEBOUNCE_CACHE_POSTING_DURATION", DEBOUNCE_CACHE_POSTING_DURATION);

      MAX_COMPARE_ACION_TIME = 10;

      _export("MAX_COMPARE_ACION_TIME", MAX_COMPARE_ACION_TIME);

      MAX_COMPARE_SCORE = 100;

      _export("MAX_COMPARE_SCORE", MAX_COMPARE_SCORE);
    }
  };
});