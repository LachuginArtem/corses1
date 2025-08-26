import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse } from './api'; // ← допиши getCourseById, если его нет

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration_hours: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await getCourseById(courseId);
        setForm({
          title: course.title,
          description: course.description,
          duration_hours: course.duration_hours,
        });
      } catch (err) {
        setError('Ошибка загрузки курса');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'duration_hours' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(courseId, form);
      navigate('/'); // или на просмотр курса
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Редактировать курс</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Заголовок"
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Описание"
        className="border p-2 w-full"
      />
      <input
        name="duration_hours"
        type="number"
        value={form.duration_hours}
        onChange={handleChange}
        placeholder="Длительность (часы)"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Сохранить
      </button>
    </form>
  );
}
