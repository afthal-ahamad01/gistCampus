import { useEffect } from "react";

const CustomAlert = ({ isOpen, onClose, onConfirm, title, message, type = "success" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 md:inset-0">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 transform transition-all scale-100 opacity-100">

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full text-sm p-1.5 ml-auto inline-flex items-center transition-colors"
                >
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>

                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {type === 'success' ? (
                            <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>
                    <p className="mb-8 text-base font-normal text-gray-500">{message}</p>

                    {/* Action */}
                    <div className="flex space-x-3 justify-center">
                        {type === 'confirm' && (
                            <button
                                onClick={onClose}
                                type="button"
                                className="w-full py-3 px-5 text-base font-medium text-center text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={type === 'confirm' && onConfirm ? onConfirm : onClose}
                            type="button"
                            className={`w-full py-3 px-5 text-base font-medium text-center text-white rounded-xl focus:ring-4 focus:outline-none transition-all ${type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300' :
                                type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300' :
                                    'bg-red-600 hover:bg-red-700 focus:ring-red-300' // confirm usually destructive
                                }`}
                        >
                            {type === 'success' ? 'Continue' : type === 'confirm' ? 'Yes, Delete' : 'Try Again'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
