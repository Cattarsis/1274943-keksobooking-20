'use strict';

window.card = (function () {

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var filters = document.querySelector('.map__filters-container');

  var onPopupCloseClick = function () {
    document.removeEventListener('keydown', onPopupEscPress);
    cardClose();
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, onPopupCloseClick);
  };

  var cardClose = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      window.pin.deactivatePins();
      card.remove();
    }
  };

  var addFeatures = function (card, featuresValue) {
    var features = card.querySelector('.popup__features');
    if (featuresValue.length > 0) {
      window.data.FEATURES.forEach(function (el) {
        if (featuresValue.indexOf(el) < 0) {
          card.querySelector('.popup__feature--' + el).classList.add('hidden');
        }
      });
    } else {
      features.classList.add('hidden');
    }
  };

  var addPhotos = function (card, photosValue) {
    var photos = card.querySelector('.popup__photos');

    if (photosValue.length > 0) {
      var photo = card.querySelector('.popup__photo');
      photosValue.forEach(function (el) {
        photo.src = el;
        photos.appendChild(photo);
        photo = photo.cloneNode(true);
      });

    } else {
      photos.classList.add('hidden');
    }
  };
  var fillCardOffer = function (card, offer) {
    card.querySelector('.popup__title').textContent = offer.title;
    card.querySelector('.popup__text--address').textContent = offer.address;
    card.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = window.data.HouseType[offer.type.toUpperCase()];
    card.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для '
    + offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'заезд после ' + offer.checkin + ', выезд до '
    + offer.checkout;
    card.querySelector('.popup__description').textContent = offer.description;
  };
  var createCard = function (cardData) {
    var card = cardTemplate.cloneNode(true);

    fillCardOffer(card, cardData.offer);
    card.querySelector('.popup__avatar').src = cardData.author.avatar;

    card.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);

    addFeatures(card, cardData.offer.features);
    addPhotos(card, cardData.offer.photos);
    return card;
  };

  var addCartToDOM = function (data) {
    window.card.cardClose();

    var currentCard = createCard(data);
    map.insertBefore(currentCard, filters);
  };

  return {
    addCartToDOM: addCartToDOM,
    cardClose: cardClose
  };
})();
