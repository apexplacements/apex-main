import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const CoursePlayerComp = ({ studentId, course }) => {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(0);

  useEffect(() => {
    fetchCourseContent();
  }, [course.course_id]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(
        `/api/lms/student/${studentId}/courses/${course.course_id}/modules`
      );
      if (res.data.success) {
        setModules(res.data.data.modules);
        setLessons(res.data.data.lessons);
        if (res.data.data.lessons.length > 0) {
          setSelectedLesson(res.data.data.lessons[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching course content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleMarkComplete = async (lesson) => {
    try {
      await apiClient.put(
        `/api/lms/student/${studentId}/lessons/${lesson.id}/progress`,
        {
          batch_id: course.batch_id,
          is_completed: true,
          watch_duration_minutes: lesson.video_duration_minutes || 0,
        }
      );
      // Refresh content
      fetchCourseContent();
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="course-player">
      <h2>{course.course_name}</h2>
      <div className="player-container">
        <div className="video-section">
          {selectedLesson ? (
            <>
              <div className="video-player">
                {selectedLesson.video_url ? (
                  <iframe
                    src={selectedLesson.video_url}
                    title={selectedLesson.lesson_title}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div style={{
                    width: "100%",
                    height: "500px",
                    background: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    Video not available
                  </div>
                )}
              </div>
              <div className="lesson-details">
                <h3>{selectedLesson.lesson_title}</h3>
                <p>Duration: {selectedLesson.video_duration_minutes} minutes</p>
                <p>Status: {selectedLesson.is_completed ? "✓ Completed" : "⏳ Not Completed"}</p>
                {!selectedLesson.is_completed && (
                  <button
                    className="btn-primary"
                    onClick={() => handleMarkComplete(selectedLesson)}
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>No lesson selected</p>
          )}
        </div>

        <div className="modules-section">
          <h3>Course Modules</h3>
          <div className="modules-list">
            {modules.map((module, index) => (
              <div key={module.id} className="accordion">
                <div
                  className={`accordion-header ${expandedModule === index ? "active" : ""}`}
                  onClick={() => setExpandedModule(expandedModule === index ? -1 : index)}
                >
                  <span>
                    {module.module_name} ({module.completed_lessons}/{module.total_lessons})
                  </span>
                  <span>{expandedModule === index ? "▼" : "▶"}</span>
                </div>
                {expandedModule === index && (
                  <div className="accordion-content active">
                    {lessons
                      .filter((l) => l.module_id === module.id)
                      .map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`lesson-item ${selectedLesson?.id === lesson.id ? "active" : ""}`}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <span className="lesson-icon">
                            {lesson.is_completed ? "✓" : ""}
                          </span>
                          <span className="lesson-title">{lesson.lesson_title}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .course-player {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .player-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        .video-section {
          display: flex;
          flex-direction: column;
        }

        .video-player {
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .lesson-details {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }

        .lesson-details h3 {
          margin-top: 0;
        }

        .modules-section h3 {
          margin-top: 0;
        }

        .modules-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .lesson-item {
          padding: 10px;
          margin-bottom: 5px;
          background: #f8f9fa;
          border-left: 3px solid #ddd;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lesson-item:hover {
          background: #ecf0f1;
          border-left-color: #3498db;
        }

        .lesson-item.active {
          background: #3498db;
          color: white;
          border-left-color: #2980b9;
        }

        .lesson-icon {
          font-weight: 600;
        }

        .lesson-title {
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .player-container {
            grid-template-columns: 1fr;
          }

          .modules-section {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursePlayerComp;
