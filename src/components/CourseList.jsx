import CourseCard from './CourseCard';
import { deleteCourse } from '../services/api';
import '../styles/CourseList.css';

const CourseList = ({ courses = [], onSelectCourse, setCourses, setError, fetchCourses }) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      return;
    }

    try {
      await deleteCourse(id);
      await fetchCourses(); // Обновляем список через API
      onSelectCourse(null);
      setError(null);
    } catch (err) {
      console.error('CourseList: Ошибка при удалении:', err);
      const errorMessage = err.response?.data?.detail
          ? `Ошибка при удалении курса: ${JSON.stringify(err.response.data.detail)}`
          : 'Ошибка при удалении курса';
      setError(errorMessage);
    }
  };

  return (
      <div className="course-list">
        {!Array.isArray(courses) || courses.length === 0 ? (
            <p className="no-courses">Курсы отсутствуют</p>
        ) : (
            <div className="course-grid">
              {courses
                  .filter((course) => course && course.id)
                  .map((course) => (
                      <CourseCard
                          key={course.id}
                          course={course}
                          onSelect={onSelectCourse}
                          onDelete={handleDelete}
                      />
                  ))}
            </div>
        )}
      </div>
  );
};

export default CourseList;