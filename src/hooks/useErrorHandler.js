import { useState } from "react";

const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    setError(errorMessage);
  };

  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
};

export default useErrorHandler;