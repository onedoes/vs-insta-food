"use strict";

importScripts("vendor/serviceworker-cache-polyfill.js");

//

var SW_VERSION = "0.9.0";
var BASE_URL = "";

var STATIC_CACHE_KEY = "odif-static-" + SW_VERSION;
var DATA_CACHE_KEY = "odif-data-" + SW_VERSION;
var IMAGE_CACHE_KEY = "odif-img-" + SW_VERSION;

console.log("// SW_VERSION_" + SW_VERSION);

self.oninstall = function (event) {
  console.info("> ON INSTALL SERVICE WORKER \"" + STATIC_CACHE_KEY + "\"");

  //
  event.waitUntil(caches.open(STATIC_CACHE_KEY).then(function (cache) {
    cache.addAll(["//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css", "/jspm_packages/github/necolas/normalize.css@3.0.2/normalize.css", "/node_modules/babel-core/browser-polyfill.js", "/jspm_packages/es6-module-loader.js", "/jspm_packages/es6-module-loader.js.map", "/jspm_packages/system.js", "/jspm_packages/system.js.map", "/jspm_packages/github/angular/bower-angular@1.3.15.js", "/jspm_packages/github/angular/bower-angular@1.3.15/angular.js", "/jspm_packages/github/angular-ui/ui-router@0.2.13.js", "/jspm_packages/github/angular-ui/ui-router@0.2.13/angular-ui-router.js", "/jspm_packages/github/jspm/nodelibs-process@0.1.1.js", "/jspm_packages/github/jspm/nodelibs-process@0.1.1/index.js", "/jspm_packages/github/firebase/firebase-bower@2.2.3.js", "/jspm_packages/github/firebase/firebase-bower@2.2.3/firebase.js", "/jspm_packages/github/systemjs/plugin-text@0.0.2.js", "/jspm_packages/github/systemjs/plugin-text@0.0.2/text.js", "/jspm_packages/npm/process@0.10.1/browser.js", "/jspm_packages/npm/lodash@3.5.0.js", "/jspm_packages/npm/lodash@3.5.0/index.js", "/images/wodefd.jpg", "/images/splashscreen.jpg", "/OdifApp.js"].map(normalize)).then(function () {
      console.info("> ADDITIONAL FILES INSTALLED IN \"" + STATIC_CACHE_KEY + "\"");
    });

    return cache.addAll(["/", "/index.html", "/all.css", "/icons/manifest.json", "/jspm.config.js", "/favicon.ico"].map(normalize)).then(function () {
      console.info("> CRITICAL FILES INSTALLED IN \"" + STATIC_CACHE_KEY + "\"");
    });
  }));
  //
};

self.onactivate = function (event) {
  // console.log('> ON ACTIVATE SERVICE WORKER "' + STATIC_CACHE_KEY + '"');

  // Remove old "odif-*" caches
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.map(function (cacheName) {
      return [cacheName, caches["delete"](cacheName)];
    })).then(function (allResult) {
      allResult.map(function (result) {
        var cacheName = result[0];
        var err = !result[1];

        var consoleFct = err ? "warn" : "info";
        var stateVbr = err ? "FAIL TO REMOVE" : "SUCCESSFULLY REMOVE";
        console[consoleFct]("> " + err + " CACHE: \"" + cacheName + "\"");
      });
    });
  }));
  //
};

self.onfetch = function (event) {
  //console.log('> ON FETCH SERVICE WORKER "' + STATIC_CACHE_KEY + '"');
  var requestURL = new URL(event.request.url);
  //console.log('> FETCHING : "' + requestURL + '"');

  if (requestURL.hostname == "scontent.cdninstagram.com") {
    event.respondWith(instagramImageResponse(event.request));
  } else if (requestURL.pathname === "/cache/medias") {
    event.respondWith(firebaseDataResponse(event.request));
  } else {
    event.respondWith(caches.match(event.request).then(function (response) {
      response || console.warn("\"" + event.request.url + "\" NOT CACHED");
      return response || fetch(event.request);
    }));
  }
};

////

function instagramImageResponse(request) {

  return caches.match(request).then(function (response) {
    if (response) {
      return response;
    }

    return fetch(request.clone()).then(function (response) {
      caches.open(IMAGE_CACHE_KEY).then(function (cache) {
        cache.put(request, response).then(function () {
          console.info("Yey img cache");
        }, function (e) {
          console.error("Nay img cache", e);
        });
      });

      return response.clone();
    });
  });
}

function firebaseDataResponse(request) {

  if (request.method === "GET") {
    console.log("===========================================================");
    console.log("===== GET ==================================");
    console.log("===========================================================");

    console.log("GET REQUEST", request);

    return caches.match(request).then(function (response) {
      return response || new Response(JSON.stringify({}));
    });
  } else if (request.method === "POST") {
    console.log("===========================================================");
    console.log("===== POST ==================================");
    console.log("===========================================================");

    var getResquest = new Request(request.url);

    console.log("GET REQUEST", getResquest);
    return Promise.all([caches.open(DATA_CACHE_KEY), request.json()]).then(function (val) {
      var cache = val[0];
      var data = val[1];
      return cache.put(getResquest, new Response(JSON.stringify(data)));
    }).then(function () {
      return new Response("Yey data cached");
    })["catch"](function () {
      return new Response("Nay data caches", {
        status: 500
      });
    });
  } else {
    return fetch(request);
  }
}

function normalize(url) {
  return BASE_URL + url;
}