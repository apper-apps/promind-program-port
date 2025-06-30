import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { formatTime } from "@/utils/dateUtils";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import { userService } from "@/services/api/userService";
import { voiceService } from "@/services/api/voiceService";

const VoiceToText = () => {
  const { user: authUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcription, setTranscription] = useState('')
  const [recordings, setRecordings] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRecording])

  const loadData = async () => {
    try {
      const [userData, recordingsData] = await Promise.all([
        userService.getCurrentUser(),
        voiceService.getRecordings()
      ])
      
      setUser(userData)
      setRecordings(recordingsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setTranscription('')
    toast.info('Recording started...')
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    
    try {
      // Simulate transcription process
      const mockTranscription = generateMockTranscription()
setTranscription(mockTranscription)
      
      const newRecording = await voiceService.saveRecording({
        duration: recordingTime,
        transcription: mockTranscription,
        userId: user?.Id || authUser?.userId || 'anonymous'
      });
      
      setRecordings(prev => [newRecording, ...prev])
      toast.success('Recording saved successfully!')
    } catch (error) {
      console.error('Failed to save recording:', error)
      toast.error('Failed to save recording')
    }
    
    setRecordingTime(0)
  }

  const generateMockTranscription = () => {
    const sampleTexts = [
      "This is a sample transcription of your voice recording. The AI has converted your speech to text with high accuracy.",
      "Hello, this is a test of the voice to text feature. It works great for taking quick notes and capturing thoughts.",
      "I'm testing the voice transcription feature. This technology is amazing for productivity and note-taking.",
      "Voice to text is incredibly useful for professionals who need to quickly capture ideas and information.",
      "This feature allows you to convert spoken words into written text, making it perfect for meetings and brainstorming sessions."
    ]
    
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyText = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription)
      toast.success('Text copied to clipboard!')
    }
  }

  const handleClearAll = () => {
    setTranscription('')
    setRecordings([])
    toast.success('All recordings cleared!')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
title="Voice to Text" 
        subtitle="Convert speech to text instantly"
        user={user || authUser}
      />
      
      <div className="p-4 space-y-6">
        {/* Recording Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-8 shadow-soft text-center"
        >
          <div className="mb-6">
            <motion.div
              animate={{ 
                scale: isRecording ? [1, 1.1, 1] : 1,
                opacity: isRecording ? [0.8, 1, 0.8] : 1
              }}
              transition={{ 
                repeat: isRecording ? Infinity : 0,
                duration: 1.5
              }}
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
              }`}
            >
              <ApperIcon name={isRecording ? 'Square' : 'Mic'} size={40} />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRecording ? 'Recording...' : 'Tap to Record'}
            </h3>
            
            {isRecording ? (
              <div className="space-y-2">
                <p className="text-3xl font-bold text-red-500">
                  {formatTime(recordingTime)}
                </p>
                <p className="text-sm text-gray-600">
                  Speak clearly for best results
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                Press and hold to start recording your voice
              </p>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant={isRecording ? 'outline' : 'primary'}
              size="lg"
              className="px-8"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>
        </motion.div>

        {/* Transcription Result */}
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transcription</h3>
              <Button
                onClick={handleCopyText}
                variant="outline"
                size="sm"
                icon="Copy"
              >
                Copy
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 leading-relaxed">{transcription}</p>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Clock" size={16} className="mr-1" />
              <span>Transcribed just now</span>
            </div>
          </motion.div>
        )}

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Recordings</h3>
              <Button
                onClick={handleClearAll}
                variant="ghost"
                size="sm"
                icon="Trash2"
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-3">
              {recordings.slice(0, 5).map((recording, index) => (
                <motion.div
                  key={recording.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-xl p-4 shadow-soft border border-gray-100"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="FileText" size={20} className="text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-2 mb-2">
                        {recording.transcription}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <ApperIcon name="Clock" size={12} className="mr-1" />
                          {formatTime(recording.duration)}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Calendar" size={12} className="mr-1" />
                          {new Date(recording.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(recording.transcription)
                        toast.success('Text copied!')
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <ApperIcon name="Copy" size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feature Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <ApperIcon name="Info" size={24} />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tap the record button to start capturing audio</li>
                <li>• Speak clearly for best transcription accuracy</li>
                <li>• Stop recording when finished</li>
                <li>• Your speech will be converted to text instantly</li>
                <li>• Copy or save transcriptions for later use</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VoiceToText