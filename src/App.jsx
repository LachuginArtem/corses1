import { useState, useEffect } from 'react';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CourseDetail from './components/CourseDetail';
import { getCourses } from './services/api';
import './App.css';

function App() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Обработка входящего токена
    useEffect(() => {
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get('access_token');

        if (access_token) {
            console.log('Получен токен доступа');
            // Сохраняем токен
            localStorage.setItem('access_token', access_token);

            // Очищаем URL от токена
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            // Загружаем курсы с новым токеном
            fetchCourses();
        }
    }, []);

    const fetchCourses = async () => {
        console.log('fetchCourses: Начало загрузки курсов');
        try {
            const data = await getCourses();
            console.log('fetchCourses: Успешный ответ:', data);
            setCourses(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('fetchCourses: Полная ошибка:', err);
            setError('Не удалось загрузить курсы');
            setCourses([]);

            // Если ошибка авторизации, перенаправляем на страницу входа
            if (err.response?.status === 401) {
                const currentUrl = window.location.href;
                window.location.href = `/auth?redirect_uri=${encodeURIComponent(currentUrl)}`;
            }
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSelectCourse = (course, isEdit = false) => {
        setSelectedCourse(course);
        setError(null);
        if (isEdit) {
            setIsFormOpen(true);
            setIsDetailOpen(false);
        } else {
            setIsDetailOpen(true);
            setIsFormOpen(false);
        }
    };

    const openForm = () => {
        setIsFormOpen(true);
        setSelectedCourse(null);
        setIsDetailOpen(false);
        setError(null);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedCourse(null);
        setError(null);
        fetchCourses();
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
        setSelectedCourse(null);
        setError(null);
    };

    return (
        <div className="app-container">
            <div className="header">
                <h1>Курсы</h1>
                <button className="add-course-button" onClick={openForm}>Добавить курс</button>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="content">
                <div className="course-list">
                    <CourseList
                        courses={courses}
                        onSelectCourse={handleSelectCourse}
                        setCourses={setCourses}
                        setError={setError}
                        fetchCourses={fetchCourses}
                    />
                </div>

                {isFormOpen && (
                    <div className="modal" onClick={closeForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <CourseForm
                                selectedCourse={selectedCourse}
                                closeForm={closeForm}
                                setError={setError}
                                setCourses={setCourses}
                            />
                            <button className="modal-close-button" onClick={closeForm}>Отмена</button>
                        </div>
                    </div>
                )}

                {isDetailOpen && selectedCourse && (
                    <div className="modal" onClick={closeDetail}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <CourseDetail
                                course={selectedCourse}
                                setError={setError}
                                setSelectedCourse={setSelectedCourse}
                            />
                            <button className="modal-close-button" onClick={closeDetail}>Закрыть</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;