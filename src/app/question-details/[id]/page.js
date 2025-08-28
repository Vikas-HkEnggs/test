"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function QuestionDetails() {
  const params = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestionDetails();
  }, []);

  const fetchQuestionDetails = async () => {
    try {
      // Fetch question details
      const questionResponse = await fetch(`/api/questions?id=${params.id}`);
      const questionData = await questionResponse.json();
      
      if (questionData.success) {
        setQuestion(questionData.data);
        
        // Fetch answers for this question
        const answersResponse = await fetch(`/api/answers?questionId=${params.id}`);
        const answersData = await answersResponse.json();
        
        if (answersData.success) {
          setAnswers(answersData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Question not found</h3>
        <Link href="/teacher">
          <p className="mt-4 text-indigo-600 hover:text-indigo-900">
            Back to Dashboard
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Question Details</h1>
              <Link href="/teacher">
                <p className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600">
                  Back to Dashboard
                </p>
              </Link>
            </div>
          </div>

          {/* Question Content */}
          <div className="px-6 py-5">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Question Title</h2>
              <p className="text-gray-800 text-xl">{question.title}</p>
            </div>

            {question.description && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{question.description}</p>
              </div>
            )}

            {question.category && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Category</h2>
                <p className="text-gray-700">{question.category}</p>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Created on {new Date(question.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Answers Section */}
          <div className="px-6 py-5 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Student Answers ({answers.length})
            </h2>

            {answers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No answers yet</h3>
                <p className="mt-1 text-sm text-gray-500">Students haven't submitted any answers to this question yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map((answer) => (
                  <div key={answer._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">Student Answer</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                    
                    {answer.feedback && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Teacher Feedback</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{answer.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}