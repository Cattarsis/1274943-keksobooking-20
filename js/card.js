'use strict';

window.card = (function () {

  var onPopupCloseClick = function () {
    document.querySelector('.popup__close').removeEventListener('click', onPopupCloseClick);
    document.removeEventListener('keydown', onPopupEscPress);
    cardClose();
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, onPopupCloseClick);
  };

  var cardClose = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
    }
  };

  var createCard = function (cardData) {
    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var card = cardTemplate.cloneNode(true);

    card.querySelector('.popup__title').textContent = cardData.offer.title;
    card.querySelector('.popup__text--address').textContent = cardData.offer.address;
    card.querySelector('.popup__text--price').textContent = cardData.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = window.data.HouseType[cardData.offer.type.toUpperCase()];
    card.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms + ' комнаты для '
    + cardData.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'заезд после ' + cardData.offer.checkin + ', выезд до '
    + cardData.offer.checkout;
    card.querySelector('.popup__description').textContent = cardData.offer.description;
    card.querySelector('.popup__avatar').src = cardData.author.avatar;
    card.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);

    document.addEventListener('keydown', onPopupEscPress);

    var features = card.querySelector('.popup__features');
    if (cardData.offer.features.length > 0) {
      for (var i = 0; i < window.data.FEATURES.length; i++) {
        var element = window.data.FEATURES[i];
        if (cardData.offer.features.indexOf(element) < 0) {
          card.querySelector('.popup__feature--' + element).classList.add('hidden');
        }
      }
    } else {
      features.classList.add('hidden');
    }

    var photos = card.querySelector('.popup__photos');

    if (cardData.offer.photos.length > 0) {
      var photo = card.querySelector('.popup__photo');
      photo.src = cardData.offer.photos[0];

      for (var j = 1; j < cardData.offer.photos.length; j++) {
        photo = photo.cloneNode(true);
        photo.src = cardData.offer.photos[j];
        photos.appendChild(photo);
      }

    } else {
      photos.classList.add('hidden');
    }

    return card;
  };

  var addCartToDOM = function (data) {
    window.card.cardClose();
    var map = document.querySelector('.map');
    var filters = document.querySelector('.map__filters-container');
    var currentCard = createCard(data);
    map.insertBefore(currentCard, filters);
  };

  return {
    createCard: createCard,
    addCartToDOM: addCartToDOM,
    cardClose: cardClose
  };
})();
