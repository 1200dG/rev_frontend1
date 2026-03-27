const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex justify-center items-center z-50">
      <div className="relative w-32 h-32 flex justify-center items-center">
        <div className="absolute w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="-scale-x-100 absolute w-12 h-12 border-4 border-white/50 border-t-transparent rounded-full animate-spin animation-delay-500"></div>
      </div>
    </div>
  );
};

export default Loader;
