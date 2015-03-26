"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Firebase = _interopRequire(require("firebase"));

var FIREBASE_BASE_URL = "https://onedoes-vs-instafood.firebaseio.com/";
exports.FIREBASE_BASE_URL = FIREBASE_BASE_URL;
var MEDIAS_REF = new Firebase("" + FIREBASE_BASE_URL + "/medias");
exports.MEDIAS_REF = MEDIAS_REF;
var MAX_MEDIA_COUNT = 11;

exports.MAX_MEDIA_COUNT = MAX_MEDIA_COUNT;
var MAX_COMPARE_ACION_TIME = 10;
exports.MAX_COMPARE_ACION_TIME = MAX_COMPARE_ACION_TIME;
var MAX_COMPARE_SCORE = 100;
exports.MAX_COMPARE_SCORE = MAX_COMPARE_SCORE;