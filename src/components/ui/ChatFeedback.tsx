import React, { useState } from 'react';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { motion } from 'framer-motion';
import { BiStar, BiSend } from 'react-icons/bi';

interface ChatFeedbackProps {
  sessionId: string;
  onSubmit: (rating: number, comment?: string) => void;
  onClose: () => void;
}

export const ChatFeedback: React.FC<ChatFeedbackProps> = ({ sessionId, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    await onSubmit(rating, comment.trim() || undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">How was your chat experience?</h3>
          <p className="text-gray-600">Your feedback helps us improve our mental health support</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors duration-200 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              <BiStar className="fill-current" />
            </motion.button>
          ))}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional comments (optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about the chat experience..."
            rows={3}
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            styles="default"
            width="full"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            styles="exotic"
            width="full"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BiSend className="text-lg" />
                Submit Feedback
              </div>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 