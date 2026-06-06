import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const MyCoursesComp = ({ studentId, onSelectCourse }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [studentId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/lms/student/${studentId}/courses`);
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📚</div>
        <p className="empty-state-text">No courses enrolled yet</p>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <h2 className="section-title">My Courses</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.batch_id} className="course-card">
            <div className="course-header">
              <h3>{course.course_name}</h3>
              <span className="course-badge">{course.progress_percentage}%</span>
            </div>
            <p className="course-trainer">👨‍🏫 {course.trainer_name}</p>
            <p className="course-duration">⏱️ {course.duration_hours} hrs</p>
            <p className="course-dates">
              📅 {new Date(course.start_date).toLocaleDateString()} to{" "}
              {new Date(course.end_date).toLocaleDateString()}
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${course.progress_percentage}%` }}
              ></div>
            </div>
            <p className="progress-text">{course.progress_percentage}% Complete</p>
            <button
              className="btn-primary"
              onClick={() => onSelectCourse(course)}
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoursesComp;
