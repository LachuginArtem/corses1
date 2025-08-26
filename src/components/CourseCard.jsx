import '../styles/CourseCard.css';

const CourseCard = ({ course, onSelect, onDelete }) => {
    return (
        <div className="course-card">
            <h3>{course.title}</h3>
            <p className="description">{course.description}</p>
            <div className="course-info">
                <p><strong>Автор:</strong> {course.author_email || 'Не указан'}</p>
                <p><strong>Длительность:</strong> {course.duration_hours || 0} ч.</p>
            </div>
            <div className="course-card-actions">
                <button onClick={() => onSelect(course)}>Просмотреть</button>
                <button onClick={() => onSelect(course, true)}>Редактировать</button>
                <button className="delete" onClick={() => onDelete(course.id)}>Удалить</button>
            </div>
        </div>
    );
};

export default CourseCard;