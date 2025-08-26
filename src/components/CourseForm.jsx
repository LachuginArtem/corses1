import { useState, useEffect } from 'react';
import { createCourse, updateCourse } from '../services/api';
import '../styles/CourseForm.css';

const CourseForm = ({ setCourses, selectedCourse, setSelectedCourse, setError, closeForm }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_hours: '',
  });

  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        title: selectedCourse.title || '',
        description: selectedCourse.description || '',
        duration_hours: selectedCourse.duration_hours?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration_hours: '',
      });
    }
  }, [selectedCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        duration_hours: parseInt(formData.duration_hours) || 0,
      };
      console.log('CourseForm: Отправка данных:', courseData);

      if (selectedCourse) {
        const response = await updateCourse(selectedCourse.id, courseData);
        console.log('CourseForm: Ответ от updateCourse:', response);
        setCourses((prev) =>
            Array.isArray(prev)
                ? prev.map((course) =>
                    course.id === selectedCourse.id ? response : course
                )
                : [response]
        );
      } else {
        const response = await createCourse(courseData);
        console.log('CourseForm: Ответ от createCourse:', response);
        setCourses((prev) =>
            Array.isArray(prev) ? [...prev, response] : [response]
        );
      }
      setSelectedCourse(null);
      setFormData({
        title: '',
        description: '',
        duration_hours: '',
      });
      closeForm();
    } catch (err) {
      console.error('CourseForm: Ошибка:', err);
      const errorMessage = err.response?.data?.detail
          ? `Ошибка при сохранении курса: ${JSON.stringify(err.response.data.detail)}`
          : `Ошибка при сохранении курса: ${err.message}`;
      setError(errorMessage);
      closeForm(); // Закрываем форму даже при ошибке
    }
  };

  return (
      <div className="course-form">
        <h2>{selectedCourse ? 'Редактировать курс' : 'Добавить новый курс'}</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Название курса"
              required
          />
          <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание курса"
              required
          />
          <input
              type="number"
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleChange}
              placeholder="Длительность (часы)"
              required
              min="0"
          />
          <button type="submit">
            {selectedCourse ? 'Обновить' : 'Создать'}
          </button>
        </form>
      </div>
  );
};

export default CourseForm;