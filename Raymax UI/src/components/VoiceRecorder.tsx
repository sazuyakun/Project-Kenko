import React, { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
// import OpenAI from "openai";
// import fs from "fs";

// const openai = new OpenAI();

interface VoiceRecorderProps {
  onSendMessage: (message: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        await convertSpeechToText(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      drawWaveform();
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else {
        setError('An error occurred while trying to start recording. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
  
    const draw = () => {
      if (!canvasCtx) return;
  
      analyser.getByteTimeDomainData(dataArray);
  
      canvasCtx.fillStyle = 'rgb(16, 24, 39)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(155, 255, 255)';
  
      canvasCtx.beginPath();
  
      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
  
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
  
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
  
        x += sliceWidth;
      }
  
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
  
      animationFrameRef.current = requestAnimationFrame(draw);
    };
  
    draw();
  };


  const convertSpeechToText = async (audioUrl: string) => {
    // const transcription = await openai.audio.transcriptions.create({
    //   file: fs.createReadStream(audioUrl),
    //   model: "whisper-1",
    // });
  
    // console.log(transcription.text);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center mb-2">
        <button
          onClick={handleRecordToggle}
          className={`p-2 rounded-full ${
            isRecording ? 'bg-red-600' : 'bg-purple-600'
          } mr-2`}
        >
          <Mic size={24} />
        </button>
        <canvas ref={canvasRef} width="200" height="50" className="bg-gray-900 rounded" />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default VoiceRecorder;