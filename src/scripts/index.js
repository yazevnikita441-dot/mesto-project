import { getUserInfo, getCardList, editUserInfo, editUserAvatar, addNewCard, deleteCardReq, likeCardReq } from "./components/api.js";
import { createCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoDefinitionTemplate = document.getElementById("popup-info-definition-template");
const cardInfoUserPreviewTemplate = document.getElementById("popup-info-user-preview-template");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalLikesList = cardInfoModalWindow.querySelector(".popup__list");



const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const profileButton = profileForm.querySelector(validationSettings.submitButtonSelector);
  changeButtonText(profileButton, "Сохранение...");
  editUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() =>
      changeButtonText(profileButton, "Сохранить")
    );
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const avatarButton = avatarForm.querySelector(validationSettings.submitButtonSelector);
  changeButtonText(avatarButton, "Сохранение...");
  editUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() =>
      changeButtonText(avatarButton, "Сохранить")
    );
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const cardButton = cardForm.querySelector(validationSettings.submitButtonSelector);
  changeButtonText(cardButton, "Создание...");
  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCardData) => {
      placesWrap.prepend(
        createCardElement(newCardData, userID, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
          onInfoClick: handleInfoClick,
        })
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() =>
      changeButtonText(cardButton, "Создать")
    );
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  clearValidation(profileForm, validationSettings)
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  clearValidation(avatarForm, validationSettings)
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  clearValidation(cardForm, validationSettings)
});

// отображение карточек
const renderInitCards = (cards) => {
  cards.forEach((data) => {
    placesWrap.append(
      createCardElement(data, userID,{
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: likeCard,
        onDeleteCard: deleteCard,
        onInfoClick: handleInfoClick,
      })
    );
  });
};

// лайк карточки
const likeCard = (likeButton, likeCount, cardID) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  likeCardReq(cardID, isLiked)
    .then((updatedLikeData) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCount.textContent = updatedLikeData.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

// удаление карточки
const deleteCard = (cardElement, cardID) => {
  deleteCardReq(cardID)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleInfoClick = (cardId) => {
  getCardList()
    .then((cards) => {

      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalLikesList.innerHTML = "";

      const cardInfo = cards.find((card) => card._id === cardId);
      
      if (!cardInfo) {
        return;
      }
      
      cardInfoModalInfoList.append(
        createInfoString(
          "Описание:", 
          cardInfo.name
        ),
        createInfoString(
          "Дата создания:",
          formatDate(new Date(cardInfo.createdAt))
        ),
        createInfoString(
          "Владелец:",
          cardInfo.owner.name
        ),
        createInfoString(
          "Количество лайков:",
          cardInfo.likes.length
        )
      );
      
      cardInfo.likes.forEach((user) => {
        const userPreview = cardInfoUserPreviewTemplate.content.cloneNode(true);
        const name = userPreview.querySelector(".popup__list-item");
        name.textContent = user.name;
        cardInfoModalLikesList.append(name);
      });

      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

// настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// cоздание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings);

let userID = null

// логика отображения карточек и данных пользователя
Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    userID = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    renderInitCards(cards);
  })
  .catch((err) => {
    console.log(err);
  });

// изменение текста кнопки при отправке
const changeButtonText = (button, text) => {
  button.textContent = text;
}

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const definitionTemp = cardInfoDefinitionTemplate.content.cloneNode(true);
  definitionTemp.querySelector('.popup__info-term').textContent = term;
  definitionTemp.querySelector('.popup__info-description').textContent = description;
  return definitionTemp;
};

