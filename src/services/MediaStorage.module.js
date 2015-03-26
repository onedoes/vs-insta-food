//

import angular from 'angular';
import _ from 'lodash';

import {
  DEBOUNCE_CACHE_POSTING_DURATION,
  MEDIAS_REF,
  FIREBASE_CONNECTION_REF,
  MAX_MEDIA_COUNT} from 'services/constants';

export default angular
  .module('odif.' + MediaStorage.name, [])
  .service('mediaStorage', MediaStorage)
  ;

////

function MediaStorage($http, $rootScope) {
  // TODO(douglasduteil): use minimal empty space
  // Array.from({ length: 5 }, (_, id) => Object.create({ id: id }));
  this.items = [];

  // Disconnection management
  // TODO(douglasduteil): find a better way to deal with reconnection
  // Case : Offline +> Online
  // Case : Online  +> Offline +> Online
  FIREBASE_CONNECTION_REF.on('value',
    _.debounce((snap) => snap.val() && Firebase.goOnline(), DEBOUNCE_CACHE_POSTING_DURATION)
  );

  // Fresh
  MEDIAS_REF
    .orderByChild('score')
    .on("value", _.debounce(_updateTrendingList, DEBOUNCE_CACHE_POSTING_DURATION), this);

  // Warm
  $http
    .get('/cache/medias')
    .then((res) => this.items = res.data);

  function _updateTrendingList(snapshot) {
    let items = _(snapshot.val())
      .sortBy('score')
      .reverse()
      .take(MAX_MEDIA_COUNT)
      .value();

    $http.post('/cache/medias', items);

    $rootScope.$evalAsync(() => this.items = items);

    //

    this.bestMediaToSend = items[0] && items[0].score > 400 && items[0];

    //

    let mediaToCountDrop = snapshot.numChildren() - MAX_MEDIA_COUNT * 2;
    if (mediaToCountDrop > 0) {
      snapshot.ref()
        .orderByChild('score')
        .limitToFirst(mediaToCountDrop)
        .once("value", (snap) => {
          _.map(snap.val(), (media, id) => snap.ref().child(id).remove())
        });
    }

  }

}
