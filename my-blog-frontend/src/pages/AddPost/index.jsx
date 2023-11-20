import "easymde/dist/easymde.min.css";
import React, { useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../API/axios.js";

export const AddPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [text, setText] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const inputFileRef = useRef(null);

    const fields = {
        title,
        text,
        imageUrl,
        tags,
    };

    const isAuth = useSelector(selectIsAuth);
    const isEditing = Boolean(id);

    const handleChangeFile = async (e) => {
        try {
            const formData = new FormData(); // Формат помогающий вшивать картинку и отправлять на бэк
            const file = e.target.files[0];
            formData.append("image", file);
            const { data } = await axios.post("/uploads", formData);
            setImageUrl(data.url);
            console.log("Успешно");
        } catch (e) {
            console.log(e);
            alert("Ошибка при загрузки файла");
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl("");
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const onSubmitHandler = async () => {
        try {
            setIsLoading(true);

            const { data } = await axios.post("./posts", fields);

            const id = data._id;

            navigate(`/posts/${id}`);

            return data;
        } catch (err) {
            console.log(err);
            alert("Ошибка при создании статьи");
        }
        setIsLoading(false);
    };

    const addPostHandler = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`./posts/${id}`, fields);
            navigate(`/posts/${id}`);
        } catch (err) {
            console.log(err);
            alert("Ошибка при изменении поста");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (id) {
            axios
                .get(`posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                    setImageUrl(data.imageUrl);
                    setTags(data.tags.join(","));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: "400px",
            autofocus: true,
            placeholder: "Введите текст...",
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    );

    if (!localStorage.getItem("token") && !isAuth) {
        return <Navigate to="/login"></Navigate>;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                onClick={() => inputFileRef.current.click()}
                variant="outlined"
                size="large"
            >
                Загрузить превью
            </Button>
            <input
                type="file"
                onChange={handleChangeFile}
                ref={inputFileRef}
                hidden // Скрыть инпут
            />
            {imageUrl && (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                    >
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`http://localhost:4444${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}
            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                classes={{ root: styles.tags }}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                variant="standard"
                placeholder="Тэги"
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={text}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                {isEditing ? (
                    <Button
                        onClick={addPostHandler}
                        size="large"
                        variant="contained"
                    >
                        Сохранить
                    </Button>
                ) : (
                    <Button
                        onClick={onSubmitHandler}
                        size="large"
                        variant="contained"
                    >
                        Опубликовать
                    </Button>
                )}
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
