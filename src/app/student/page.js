"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudentDashboard() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow flex justify-between items-center p-3">
        <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
        </div>
        <Link href="/">
          <p className="bg-amber-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-500">
            Home
          </p>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No questions available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for new questions from your teacher.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
              >
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {question.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {question.description}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Posted on{" "}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.answerCount} answers
                      </span>
                      <Link href={`/student/answer/${question._id}`}>
                        <p className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          {question.answerCount > 0
                            ? "View Answers"
                            : "Be the first to answer"}
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
