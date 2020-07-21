'use strict';

window.data = (function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var ADVERTS_COUNT = 8;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var NO_GUEST_ROOM_COUNT = 100;
  var NO_GUEST_VALUE = 0;

  var HouseType = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'};

  var adverts;
  return {
    NO_GUEST_ROOM_COUNT: NO_GUEST_ROOM_COUNT,
    NO_GUEST_VALUE: NO_GUEST_VALUE,
    ADVERTS_COUNT: ADVERTS_COUNT,
    ADVERTS: adverts,
    FEATURES: FEATURES,
    HouseType: HouseType,
    MIN_Y: MIN_Y,
    MAX_Y: MAX_Y
  };
})();
