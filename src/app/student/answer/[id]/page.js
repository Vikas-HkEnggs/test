// src/app/student/answer/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function AnswerQuestion() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchAnswers();
    }
  }, [id]);

  const startEditing = (answer) => {
    setEditingId(answer._id);
    setEditText(answer.answerText);
  };

  const handleUpdateAnswer = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/answers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, answerText: editText }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditText("");
        fetchAnswers();
      }
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const handleDeleteAnswer = async (id) => {
    if (!confirm("Are you sure you want to delete this answer?")) return;

    try {
      const response = await fetch(`/api/answers?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAnswers();
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      if (data.success) {
        const foundQuestion = data.data.find((q) => q._id === id);
        setQuestion(foundQuestion);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`/api/answers?questionId=${id}`);
      const data = await response.json();
      if (data.success) {
        setAnswers(data.data);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !studentName.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: id,
          answerText,
          answeredBy: studentName,
        }),
      });

      if (response.ok) {
        setAnswerText("");
        setStudentName("");
        fetchAnswers(); // Refresh answers
      } else {
        console.error("Failed to submit answer");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Question not found
          </h1>
          <button
            onClick={() => router.push("/student")}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/student")}
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            &larr; Back to questions
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
          {question.description && (
            <p className="mt-2 text-gray-600">{question.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Answers ({answers.length})
              </h2>

              {answers.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No answers yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to answer this question!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <div
                      key={answer._id}
                      className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                    >
                      {answer._id === editingId ? (
                        <form
                          onSubmit={(e) => handleUpdateAnswer(e, answer._id)}
                          className="space-y-2"
                        >
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full border rounded p-2 text-black"
                          />
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="px-3 py-1 bg-indigo-600 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-400 text-white rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="text-gray-800">{answer.answerText}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span>By {answer.answeredBy}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(answer.answeredAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2 flex space-x-4 text-sm">
                            <button
                              onClick={() => startEditing(answer)}
                              className="text-indigo-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAnswer(answer._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Your Answer
              </h2>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <div>
                  <label
                    htmlFor="studentName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Answer
                  </label>
                  <textarea
                    id="answer"
                    rows={4}
                    required
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
