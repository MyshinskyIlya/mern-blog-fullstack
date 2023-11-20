import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неверный формат почт").isEmail(),
    body(
        "password",
        "Неверный формат пароля или пароль короче 5 символов"
    ).isLength({ min: 5 }), // Если меньше 5 символов оповести !
];

export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body(
        "password",
        "Неверный формат пароля или пароль короче 5 символов"
    ).isLength({ min: 5 }), // Если меньше 5 символов оповести !
    body("fullName", "Имя пользователя короче 3 символов").isLength({ min: 3 }),
    body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
    body("text", "Введите текст статьи").isLength({ min: 10 }).isString(), // Если меньше 5 символов оповести !
    body("tags", "Неверный формат тэгов").optional().isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];

export const postUpdateValidation = [
    body("title", "Введите заголовок статьи")
        .optional()
        .isLength({ min: 3 })
        .isString(),
    body("text", "Введите текст статьи")
        .optional()
        .isLength({ min: 10 })
        .isString(), // Если меньше 5 символов оповести !
    body("tags", "Неверный формат тэгов").optional().isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
