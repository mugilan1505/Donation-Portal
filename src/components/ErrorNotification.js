import React, { useEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorNotification = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide the error after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="error-notification">
      <FaExclamationCircle />
      <span>{message}</span>
    </div>
  );
};

export default ErrorNotification; 