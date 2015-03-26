//

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import moment from 'moment';
import _ from 'lodash';


//

import {MEDIAS_REF} from 'services/constants';

const MOMENT_STARTING_HOUR = 21;
const MOMENT_ENDING_HOUR = 23;
const MIDNIGHT_MOMENT_DATA = {
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};
const MOMENT_NOW_BASED = moment();
if (MOMENT_NOW_BASED.hour() > MOMENT_ENDING_HOUR) {
  MOMENT_NOW_BASED.add(1, 'd');
}
const MOMENT_START_DATE = moment(MOMENT_NOW_BASED)
  .set(
  _.assign({}, MIDNIGHT_MOMENT_DATA,
    { hour: MOMENT_STARTING_HOUR })
);
const MOMENT_END_DATE = moment(MOMENT_NOW_BASED)
  .set(
  _.assign({}, MIDNIGHT_MOMENT_DATA,
    { hour: MOMENT_ENDING_HOUR })
);

const TRENDING_STATUS = {
  WAITING_TIME: 'WAITING_TIME',
  MOMENT_TIME: 'MOMENT_TIME',
  SPAMMING_TIME: 'SPAMMING_TIME'
};

import MediaStorageModule from 'services/MediaStorage.module';

//

import trendingHtmlTemplate from './trending.html!text';

////

export default angular
  .module('odif.trending', [
    MediaStorageModule.name,
    'ui.router'
  ])
  .config(trendingRoutesConfig)
  ;

////

function trendingRoutesConfig($stateProvider) {

  $stateProvider.state('trending', {
    url: '/',
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
    const now = new Date();
    const startTimeDiff = MOMENT_START_DATE - now;

    this.status = _getNewStatus();

    $interval(_.bind(_countDownTimerLoop, this), 1000);
  }

  function _countDownTimerLoop() {
    this.remainingTime = moment(MOMENT_START_DATE)
      .subtract(moment())
      .format('HH:mm:ss');

    this.status = _getNewStatus(this.remainingTime);
  }

  function _getNewStatus() {
    const now = moment();
    if (moment.min(now, MOMENT_START_DATE) === now) {
      return TRENDING_STATUS.WAITING_TIME;
    }

    return TRENDING_STATUS.MOMENT_TIME;
  }


  function gotTocompare() { $state.go('compare.loading'); }

  function getItemClassRank(index, ranks = ['']) {
    var rankClass = ranks[index];
    return rankClass || ranks[ranks.length - 1];
  }

  function reserve(media) {
    MEDIAS_REF.child(media.id).remove(() => {
      _sendMeetupCommentAboutEatingThisForDinner(media);
      mediaStorage.bestMediaToSend = null;
    });
  }

  function _sendMeetupCommentAboutEatingThisForDinner(media) {
    $http.post('https://choasrating-doogd.c9.io/comment', {
      link: media.link
    })
      .then((res) => console.log('Chaos comment posted', res) )
      .catch((e) => console.error('Chaos comment lost...', e) );
  }
}
TrendingController.nameAs = 'trendingCtrl';
