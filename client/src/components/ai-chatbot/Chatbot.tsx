import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiMinus, FiSend } from 'react-icons/fi';

const PREDEFINED_QA: Record<string, string> = {
  'How do I reset my password?': 'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your registered email.',
  'How can I update my profile information?': 'You can update your profile information from the Profile page after logging in.',
  'How do I add or remove users?': 'Only users with the appropriate permissions (e.g., Admin or Manager roles) can add or remove users from the User Management page.',
  'What permissions do different roles have?': 'Each role has specific permissions. You can view or edit role permissions in the Roles Management section.',
  "Why can't I see the user edit option?": 'If you cannot see the user edit option, your account may not have the required permissions. Please contact your administrator to request access.',
  'How can I generate a report?': 'Go to the Reports section and select the type of report you want to generate. Follow the on-screen instructions.',
  'Who do I contact for technical support?': 'For technical support, please email support@example.com or contact your system administrator.',
  'Where can I find training resources?': 'Training resources are available in the Training section of the application.',
  'How do I access analytics or dashboard features?': 'Analytics and dashboard features are available on the Dashboard page. Access may depend on your role permissions.',
  'How do I change my notification settings?': 'Notification settings can be changed from the Settings page under the Notifications tab.',
};

const COLORS = {
  primary: '#6C63FF',
  secondary: '#F5F6FA',
  accent: '#FF6584',
  user: '#E0E7FF',
  bot: '#F1F0F6',
};


type ChatStep = 'welcome' | 'answering' | 'ask_more' | 'thank_you';

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<ChatStep>('welcome');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, minimized]);

  // Reset chat when closed
  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
    setMessages([]);
    setInput('');
    setStep('welcome');
  };

  // Minimize keeps state
  const handleMinimize = () => {
    setMinimized(true);
  };

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    if (messages.length === 0) {
      setMessages([
        { from: 'bot', text: 'Hi! How can I help you today? You can type your question or select one below.' },
      ]);
      setStep('welcome');
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((msgs) => [...msgs, { from: 'user', text }]);

    // If we're in the ask_more step, check for yes/no
    if (step === 'ask_more') {
      const lower = text.trim().toLowerCase();
      if (lower === 'yes' || lower === 'y') {
        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            { from: 'bot', text: 'Sure! Please select a question below or type your query.' },
          ]);
          setStep('welcome');
        }, 500);
      } else if (lower === 'no' || lower === 'n') {
        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            { from: 'bot', text: 'Thank you! If you need more help, just type Hi or Yes again.' },
          ]);
          setStep('thank_you');
        }, 500);
      } else {
        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            { from: 'bot', text: 'Please type "yes" if you need more help, or "no" to end the chat.' },
          ]);
        }, 500);
      }
      setInput('');
      return;
    }

    // If in thank_you step and user types hi/yes/reload, restart questions
    if (step === 'thank_you') {
      const lower = text.trim().toLowerCase();
      if (lower === 'hi' || lower === 'yes' || lower === 'reload') {
        setTimeout(() => {
          setMessages([
            { from: 'bot', text: 'Hi! How can I help you today? You can type your question or select one below.' },
          ]);
          setStep('welcome');
        }, 300);
        setInput('');
        return;
      }
    }
    // If matches a predefined question, answer
    if (PREDEFINED_QA[text]) {
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: PREDEFINED_QA[text] },
          { from: 'bot', text: 'Do you need more help? Type "yes" or "no".' },
        ]);
        setStep('ask_more');
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: "I'm here to help! Please select a question or rephrase." },
        ]);
      }, 500);
    }
    setInput('');
  };

  const handleSelectQuestion = (q: string) => {
    handleSend(q);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: COLORS.primary,
            color: '#fff',
            borderRadius: '50%',
            width: 64,
            height: 64,
            boxShadow: '0 4px 24px rgba(108,99,255,0.2)',
            border: 'none',
            zIndex: 1000,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            transition: 'background 0.2s',
          }}
          aria-label="Open Chatbot"
        >
          <FiMessageCircle />
        </button>
      )}
      {/* Chatbot Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 360,
            maxWidth: '90vw',
            height: minimized ? 60 : 480,
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(108,99,255,0.18)',
            zIndex: 1001,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'height 0.3s',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: COLORS.primary,
              color: '#fff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 18 }}>Help Chatbot</span>
            <div>
              <button
                onClick={handleMinimize}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, marginRight: 8, cursor: 'pointer' }}
                aria-label="Minimize"
              >
                <FiMinus />
              </button>
              <button
                onClick={handleClose}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
          </div>
          {/* Minimized bar */}
          {minimized ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: COLORS.secondary,
                color: COLORS.primary,
                fontWeight: 500,
                fontSize: 16,
              }}
              onClick={() => setMinimized(false)}
            >
              Chatbot minimized. Click to open.
            </div>
          ) : (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  padding: 16,
                  overflowY: 'auto',
                  background: COLORS.secondary,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
                ref={messagesEndRef}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.from === 'user' ? COLORS.user : COLORS.bot,
                      color: '#222',
                      borderRadius: 16,
                      padding: '8px 14px',
                      maxWidth: '80%',
                      boxShadow: msg.from === 'user' ? '0 2px 8px #e0e7ff80' : '0 2px 8px #f1f0f680',
                      fontSize: 15,
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              {/* Predefined Questions */}
              {step === 'welcome' && (
                <div
                  style={{
                    padding: '0 16px 12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}
                >
                  {Object.keys(PREDEFINED_QA).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSelectQuestion(q)}
                      style={{
                        background: '#fff',
                        color: COLORS.primary,
                        border: `1px solid ${COLORS.primary}`,
                        borderRadius: 12,
                        padding: '8px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: 15,
                        transition: 'background 0.2s',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {/* Input */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend(input);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 16,
                  borderTop: `1px solid #eee`,
                  background: '#fff',
                  gap: 8,
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 12,
                    padding: '8px 12px',
                    fontSize: 15,
                    outline: 'none',
                  }}
                  disabled={minimized}
                />
                <button
                  type="submit"
                  style={{
                    background: COLORS.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '8px 12px',
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: minimized || !input.trim() ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={minimized || !input.trim()}
                  aria-label="Send"
                >
                  <FiSend />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
