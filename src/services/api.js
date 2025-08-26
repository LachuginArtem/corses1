import axios from 'axios';

const API_URL = 'http://localhost:8001';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Интерцептор запросов: добавляем Authorization заголовок
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор ответа: обрабатываем 401 и редиректим
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const redirectUrl = error.response.data?.redirect_url || '/auth';
      console.log('Не авторизован. Редирект на:', redirectUrl);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('session_id');
      window.location.href = redirectUrl;
    }
    return Promise.reject(error);
  }
);

// API функции (оставляем без изменений)
export const getCourses = async () => {
  console.log(`getCourses: Отправляем GET-запрос на ${API_URL}/courses/`);
  try {
    const response = await api.get('/courses/');
    console.log('getCourses: Ответ сервера:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('getCourses: Ошибка', err);
    return [];
  }
};

export const getCourse = async (courseId) => {
  console.log(`getCourse: Отправляем GET-запрос на ${API_URL}/courses/${courseId}`);
  try {
    const response = await api.get(`/courses/${courseId}`);
    console.log('getCourse: Ответ сервера:', response.data);
    return response.data;
  } catch (err) {
    console.error('getCourse: Ошибка', err);
    throw err;
  }
};

export const createCourse = async (courseData) => {
  console.log(`createCourse: Отправляем POST-запрос на ${API_URL}/courses/`, courseData);
  try {
    const response = await api.post('/courses/', courseData);
    console.log('createCourse: Ответ сервера:', response.data);
    return response.data;
  } catch (err) {
    console.error('createCourse: Ошибка', err);
    throw err;
  }
};

export const updateCourse = async (courseId, updatedData) => {
  console.log(`updateCourse: Отправляем PUT-запрос на ${API_URL}/courses/${courseId}`, updatedData);
  try {
    const response = await api.put(`/courses/${courseId}`, updatedData);
    console.log('updateCourse: Ответ сервера:', response.data);
    return response.data;
  } catch (err) {
    console.error('updateCourse: Ошибка', err);
    throw err;
  }
};

export const deleteCourse = async (courseId) => {
  console.log(`deleteCourse: Отправляем DELETE-запрос на ${API_URL}/courses/${courseId}`);
  try {
    const response = await api.delete(`/courses/${courseId}`);
    console.log('deleteCourse: Ответ сервера:', response.data);
    return response.data;
  } catch (err) {
    console.error('deleteCourse: Ошибка', err);
    throw err;
  }
};