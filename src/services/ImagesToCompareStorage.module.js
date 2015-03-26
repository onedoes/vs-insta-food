//

import angular from 'angular';
import _ from 'lodash';

import MediaStorageModule from 'services/MediaStorage.module';
import {MAX_MEDIA_COUNT} from 'services/constants';

export default angular
  .module('odif.imagesToCompareStorage', [
    MediaStorageModule.name
  ])
  .service('imagesToCompareStorage', ImagesToCompareStorage)
  ;

////


const INSTAGRAM_TAG = 'foodporn';
const INSTAGRAM_ENDPOINT = `tags/${INSTAGRAM_TAG}/media/recent`;
const INSTAGRAM_CLIENT_ID = '467ede5a6b9b48ae8e03f4e2582aeeb3';
const INSTAGRAM_LIMIT_COUNT = MAX_MEDIA_COUNT;

const INSTAGRAM_URL = `https://api.instagram.com/v1/${INSTAGRAM_ENDPOINT}?client_id=${INSTAGRAM_CLIENT_ID}&count=${INSTAGRAM_LIMIT_COUNT}&callback=JSON_CALLBACK`;

const TRASH_TAGS = [
  '1000likes',
  'abs',
  'beautiful',
  'bug',
  'cute',
  'fashion',
  'fit',
  'fitness',
  'fitnessaddict',
  'followback',
  'followforfollow',
  'followme',
  'gym',
  'iloveher',
  'imissyou',
  'instacool',
  'instagood',
  'instalike',
  'instafollow',
  'like4like',
  'likeforlike',
  'likemyphoto',
  'lover',
  'mustfollow',
  'snapchat',
  'tags4tags',
  'tagsforlikes',
  'teamfollowback',
  'vscocam',
  'vscogram'
];

////


function ImagesToCompareStorage($http, mediaStorage) {

  let next = '';
  let iteration = 0;
  this.pictures = [];

  this.storage = [];
  this.comparingPairs = [];
  this.currentPairIndex = 0;

  this.initNewStore = initNewStore;
  this.resetWith = resetWith;
  this.nextPair = nextPair;

  ////

  function initNewStore() {
    return get50Pictures.call(this, mediaStorage.items)
      .then(function (pictures) {
        return pictures;
      })
      .then(resetWith.bind(this))
      ;
  }

  function nextPair() {
    return this.comparingPairs[this.currentPairIndex++] || [];
  }

  function resetWith(pictures) {
    this.currentPairIndex = 0;

    this.storage = _.indexBy(pictures, 'id');

    let lastId;
    this.comparingPairs = _(this.storage)
      .keys()
      .shuffle()
      .reduce((pairs, id) => {

        if (!lastId) {
          lastId = id;
          return pairs;
        }

        pairs.push([lastId, id]);
        lastId = null;
        return pairs;
      }, []);

  }

  function get50Pictures(lastPictures = []) {
    return getInstagramPhotos().then(
      (newPictures) => {
        ++iteration;
        return _(lastPictures).concat(newPictures).uniq('id').value();
      }
    );
  }

  function getInstagramPhotos() {
    let url = INSTAGRAM_URL;

    if (next.length) {
      // TODO(douglasduteil): Recursive promise call
      url += `&min_tag_id=${next}`;
    }

    return $http.jsonp(INSTAGRAM_URL).then((res) => {
      // TODO(douglasduteil): Recursive promise call
      // next = res.data.pagination.next_max_tag_id;
      return _(res.data.data)
        .filter((pic) => _.includes(pic.tags, INSTAGRAM_TAG))
        .filter((pic) => !_.intersection(pic.tags, TRASH_TAGS).length)
        .map((pic) => {
          pic.date = new Date(parseInt(pic.created_time) * 1000);
          pic.images.low_resolution.url = pic.images.low_resolution.url.replace('http://', 'https://');
          return pic;
        })
        .value();
    })
  }
}

