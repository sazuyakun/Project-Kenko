import React, { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ReportAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setAnalysis(
        "Based on the uploaded X-ray report and your medical history, we've detected signs of mild pneumonia in your left lung. Given your history of asthma, we recommend scheduling an appointment with your pulmonologist for a more detailed examination. In the meantime, continue with your prescribed asthma medications and monitor for any increased difficulty in breathing. Avoid strenuous activities and stay hydrated. If symptoms worsen, seek immediate medical attention."
      );
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 gradient-text">Report Analysis</h2>
      <p className="text-gray-300 mb-6">
        Upload X-ray or other medical reports and receive comprehensive clinical
        inferences personalized to your medical history, allergies, medications,
        and previous diagnoses.
      </p>

      <div className="mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.png,.dicom"
          className="hidden"
          id="report-upload"
        />
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          htmlFor="report-upload"
          className="flex items-center justify-center w-full p-4 bg-purple-600 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-purple-700"
        >
          <Upload size={24} className="mr-2" />
          {file ? file.name : "Select medical report"}
        </motion.label>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        disabled={!file || isLoading}
        className={`w-full p-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
          file && !isLoading
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          <>
            <FileText size={24} className="mr-2" />
            Analyze Report
          </>
        )}
      </motion.button>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-gray-700 rounded-lg p-4"
        >
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <CheckCircle size={24} className="mr-2 text-green-500" />
            Analysis Results
          </h3>
          <p className="text-gray-300">{analysis}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReportAnalysis;
