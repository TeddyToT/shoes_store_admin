const LoadingSpinner = () => (
    <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-center bg-slate-500 bg-opacity-50 z-50">
      <div className="w-30 h-30 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
  
  export default LoadingSpinner;
  