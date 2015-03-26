//

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import _ from 'lodash';

import {MEDIAS_REF} from 'services/constants';
import ImagesToCompareStorageModule from 'services/ImagesToCompareStorage.module';

import CompareActionController from './CompareActionController';
import CompareLoadingController from './CompareLoadingController';
import compareActionHtmlTemplate from './compareAction.html!text';
import compareLoadingHtmlTemplate from './compareLoading.html!text';

////

export default angular
  .module('odif.compare', [
    ImagesToCompareStorageModule.name,
    'ui.router'
  ])
  .config(odifCompareConfig);

///

function odifCompareConfig($stateProvider) {
  $stateProvider.state('compare', {
    abstract: true,
    url: '/compare',
    template: '<ui-view></ui-view>'
  });

  $stateProvider.state('compare.loading', {
    url: '/loading',
    template: compareLoadingHtmlTemplate,
    controller: CompareLoadingController
  });

  $stateProvider.state('compare.action', {
    url: '/:leftId...:rightId',
    template: compareActionHtmlTemplate,
    controller: CompareActionController,
    controllerAs: CompareActionController.nameAs,
    resolve: CompareActionController.resolve
  });

}
