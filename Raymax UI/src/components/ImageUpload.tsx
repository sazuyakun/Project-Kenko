// import React, { useState } from 'react';
// import { Upload } from 'lucide-react';
// import axios from 'axios';
// import { motion } from 'framer-motion';

// const API2_URL = 'https://api2-url-for-image-prediction.com/predict'; // Replace with the actual API2 URL

// const ImageUpload: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [prediction, setPrediction] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert('Please select an image first');
//       return;
//     }

//     setIsLoading(true);
//     setPrediction(null);

//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const response = await axios.post(API2_URL, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setPrediction(response.data.prediction);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Error uploading image. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="mt-4"
//     >
//       <input
//         type="file"
//         onChange={handleFileChange}
//         accept="image/*"
//         className="hidden"
//         id="image-upload"
//       />
//       <motion.label
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         htmlFor="image-upload"
//         className="w-full bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center cursor-pointer mb-4 transition-all duration-300"
//       >
//         <Upload size={20} className="mr-2" />
//         Select medical image
//       </motion.label>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={handleUpload}
//         className="w-full bg-green-600 text-white p-2 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
//         disabled={!selectedFile || isLoading}
//       >
//         {isLoading ? 'Analyzing...' : 'Analyze Image'}
//       </motion.button>
//       {previewUrl && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="mt-4 bg-gray-700 rounded-lg p-2"
//         >
//           <img
//             src={previewUrl}
//             alt="Selected medical image"
//             className="w-full h-48 object-cover rounded-lg"
//           />
//         </motion.div>
//       )}
//       {prediction && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mt-4 bg-gray-700 rounded-lg p-4"
//         >
//           <h3 className="text-lg font-semibold mb-2 gradient-text">Prediction:</h3>
//           <p className="animate-typing">{prediction}</p>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default ImageUpload;


import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API2_URL = 'https://api2-url-for-image-prediction.com/predict'; // Replace with the actual API2 URL

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Commenting out the actual API call and using dummy data
      /*
      const response = await axios.post(API2_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data.prediction);
      */

      // Simulating an API call and setting dummy data
      setTimeout(() => {
        setPrediction('Effusion');
        setIsLoading(false);
      }, 2000); // Simulating a 2-second delay
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <motion.label
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        htmlFor="image-upload"
        className="w-full bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center cursor-pointer mb-4 transition-all duration-300"
      >
        <Upload size={20} className="mr-2" />
        Select medical image
      </motion.label>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        className="w-full bg-green-600 text-white p-2 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Image'}
      </motion.button>
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-700 rounded-lg p-2"
        >
          <img
            src={previewUrl}
            alt="Selected medical image"
            className="w-full h-48 object-cover rounded-lg"
          />
        </motion.div>
      )}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-700 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold mb-2 gradient-text">Prediction:</h3>
          <p className="animate-typing">{prediction}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageUpload;
