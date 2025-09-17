import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
