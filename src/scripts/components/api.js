const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "756d4d8d-96a3-4566-823d-ed5462304c29",
    "Content-Type": "application/json",
  },
};

/* Проверяем, успешно ли выполнен запрос, и отклоняем промис в случае ошибки. */
const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

/* GET запрос о пользователе с сервера*/
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers, // Подставляем заголовки из config
  }).then(getResponseData); //Проверка ответа и возврат данных
};

/* GET запрос о карточках*/
export const getCardList = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers,
    }).then(getResponseData);
};

/* PATCH запрос на обновление данных пользователя */
export const editUserInfo = ({name, about}) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: "PATCH",
        headers: config.headers,
        body: JSON.stringify({
            name,
            about,
        }),
    }).then(getResponseData);
};

/* PATCH запрос на обновление аватара пользователя */
export const editUserAvatar = (avatar) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: config.headers,
        body: JSON.stringify({ avatar }),
    }).then(getResponseData);
};

/* POST запрос на добавление новой карточки */
export const addNewCard = ({name, link}) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({
            name,
            link,
        }),
    }).then(getResponseData);
};

/* DELETE запрос на удаление карточки */
export const deleteCardReq = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: config.headers,
    }).then(getResponseData);
};

/* PUT запрос на изменение лайка */
export const likeCardReq = (cardId, isLiked) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: isLiked ? "DELETE" : "PUT",
        headers: config.headers,
    }).then(getResponseData);
};