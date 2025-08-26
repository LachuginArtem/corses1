import '../styles/CourseDetail.css';

const CourseDetail = ({ course, setError, setSelectedCourse }) => {
  if (!course) return <p>Курс не найден</p>;

  return (
    <div className="course-detail">
      <h2>{course.title || 'Без названия'}</h2>
      <p>{course.description || 'Без описания'}</p>
      <p><strong>Автор:</strong> {course.author || 'Не указан'}</p>
      <p><strong>Длительность:</strong> {course.duration_hours || 0} ч.</p>
    </div>
  );
};

export default CourseDetail;