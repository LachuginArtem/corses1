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