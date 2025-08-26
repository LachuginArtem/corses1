import '../styles/CourseCard.css';

const CourseCard = ({ course, onSelect, onDelete }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p><strong>Автор:</strong> {course.author}</p>
      <p><strong>Длительность:</strong> {course.duration_hours} ч.</p>
      <div className="course-card-actions">
        <button onClick={() => onSelect(course)}>Просмотреть</button>
        <button onClick={() => onSelect(course, true)}>Редактировать</button>
        <button className="delete" onClick={() => onDelete(course.id)}>Удалить</button>
      </div>
    </div>
  );
};

export default CourseCard;