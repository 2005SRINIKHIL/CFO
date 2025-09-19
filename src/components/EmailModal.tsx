import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, Clock } from 'lucide-react';
import EmailService from '../lib/email';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  onEmailSent: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, reportTitle, onEmailSent }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: `CFO Dashboard Report - ${reportTitle}`,
    message: 'Please find the attached financial report from CFO Dashboard.'
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Request notification permission when modal opens
  React.useEffect(() => {
    if (isOpen) {
      EmailService.requestNotificationPermission();
    }
  }, [isOpen]);

  const handleSendNow = async () => {
    if (!emailData.to) {
      alert('Please enter recipient email address');
      return;
    }

    setIsSending(true);
    try {
      const success = await EmailService.sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.message
      });

      if (success) {
        alert('Email sent successfully!');
        onEmailSent();
        onClose();
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSchedule = async () => {
    if (!emailData.to || !scheduleDate || !scheduleTime) {
      alert('Please fill in all fields for scheduling');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    if (scheduledDateTime <= new Date()) {
      alert('Scheduled time must be in the future');
      return;
    }

    setIsSending(true);
    try {
      const success = await EmailService.scheduleEmail({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.message
      }, scheduledDateTime);

      if (success) {
        alert(`Email scheduled for ${scheduledDateTime.toLocaleString()}`);
        onEmailSent();
        onClose();
      } else {
        alert('Failed to schedule email. Please try again.');
      }
    } catch (error) {
      console.error('Email scheduling error:', error);
      alert('Failed to schedule email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setEmailData({
      to: '',
      subject: `CFO Dashboard Report - ${reportTitle}`,
      message: 'Please find the attached financial report from CFO Dashboard.'
    });
    setIsScheduling(false);
    setScheduleDate('');
    setScheduleTime('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isScheduling ? 'Schedule Report' : 'Email Report'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              {isScheduling && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              {!isScheduling ? (
                <>
                  <button
                    onClick={handleSendNow}
                    disabled={isSending}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isSending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSending ? 'Sending...' : 'Send Now'}</span>
                  </button>
                  <button
                    onClick={() => setIsScheduling(true)}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsScheduling(false)}
                    className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={isSending}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isSending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    <span>{isSending ? 'Scheduling...' : 'Schedule Email'}</span>
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-full mt-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;
