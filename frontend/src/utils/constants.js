export const config = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__input-error_active'
  };

  export const popupEdit = document.querySelector("#popup-edit");
  export const openEditProfilePopupBtn = document.querySelector(".profile__edit-button");
  export const profileForm = popupEdit.querySelector(".popup__container");
  export const nameInput = profileForm.querySelector('input[name="name"]');
  export const jobInput = profileForm.querySelector('input[name="description"]');
  export const profileName = document.querySelector(".profile__name");
  export const profileCaption = document.querySelector(".profile__caption");
  export const profileAvatar = document.querySelector('.profile__avatar');
  export const editCardForm = popupEdit.querySelector('.popup__form');
  export const popupAdd = document.querySelector("#popup-add");
  export const addCardForm = popupAdd.querySelector('.popup__form');
  export const openPopupAdd = document.querySelector(".profile__add-button");
  export const itemTemplate = document.querySelector("#template").content;
  export const elements = document.querySelector(".elements");
  export const popupPhoto = document.querySelector("#popup-photo");
  export const imgPopupPhoto = popupPhoto.querySelector(".popup__photo");
  export const captionPopupPhoto = popupPhoto.querySelector(".popup__caption");
  export const allPopup = document.querySelectorAll('.popup')
  export const popupDelete = document.querySelector('#popup-confirmation'); 
  export const popupAvatar = document.querySelector('#avatar-update');
  export const avatarCardForm = popupAvatar.querySelector('.popup__form');
  export const userId = null;
  export const baseUrl = 'https://maxi.backend.nomoredomains.work';