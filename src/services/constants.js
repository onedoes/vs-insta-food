import Firebase from 'firebase';

export const FIREBASE_BASE_URL = 'https://onedoes-vs-instafood.firebaseio.com/';
export const MEDIAS_REF = new Firebase(`${FIREBASE_BASE_URL}/medias`);
export const FIREBASE_CONNECTION_REF = new Firebase(`${FIREBASE_BASE_URL}/.info/connected`);
export const MAX_MEDIA_COUNT = 12;

export const DEBOUNCE_CACHE_POSTING_DURATION = 500;

export const MAX_COMPARE_ACION_TIME = 10;
export const MAX_COMPARE_SCORE = 100;
