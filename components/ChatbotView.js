import React, { useState, useEffect, useRef } from 'react';
import { 
  FaRobot, 
  FaUser, 
  FaPaperPlane, 
  FaSpinner,
  FaSmile,
  FaHeart,
  FaUtensils,
  FaTint,
  FaClock,
  FaPills,
  FaComments
} from 'react-icons/fa';
import '../styles/ChatbotView.css';

function ChatbotView() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const messagesEndRef = useRef(null);
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting when component mounts
  useEffect(() => {
    if (!showNamePrompt && messages.length === 0) {
      const greeting = `Good ${getTimeOfDay()}, ${userName}! 👋\n\nI'm your medication assistant. I can help you with:\n• Medication reminders\n• Side effect tracking\n• Wellness tips\n• Answering questions about your medications\n\nHow can I assist you today?`;
      
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: greeting,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, [showNamePrompt, userName]);

  // Get time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Get medication names for context
  const getMedicationNames = () => {
    return medications.map(med => med.name);
  };

  // Generate bot responses based on user input
  const generateBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    const medNames = getMedicationNames();
    const timeOfDay = getTimeOfDay();

    // Check if user mentions a specific medication
    const mentionedMed = medNames.find(med => 
      lowerMsg.includes(med.toLowerCase())
    );

    // Get medication details if mentioned
    const getMedDetails = (medName) => {
      return medications.find(med => 
        med.name.toLowerCase() === medName.toLowerCase()
      );
    };

    // Response patterns
    const responses = [];

    // Greetings
    if (lowerMsg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      const greeting = timeOfDay === 'morning' ? 'morning' : 
                      timeOfDay === 'afternoon' ? 'afternoon' : 'evening';
      responses.push(
        `Good ${greeting}, ${userName}! 🌟\n\nHow are you feeling today? I'm here to help with your medications and wellness.`
      );
    }

    // Feeling/wellness check
    if (lowerMsg.includes('feeling') || lowerMsg.includes('how are you')) {
      responses.push(
        `Thank you for asking, ${userName}! I'm here to support you. 💙\n\nHow have you been feeling since starting your medications? Any side effects you'd like to discuss?`
      );
    }

    // Medication adherence
    if (lowerMsg.includes('take') || lowerMsg.includes('took') || lowerMsg.includes('medication') || lowerMsg.includes('pill')) {
      if (medications.length === 0) {
        responses.push(
          `I don't see any medications in your schedule yet, ${userName}. 📋\n\nWould you like to add some? You can use the Schedule tab to add your medications.`
        );
      } else if (mentionedMed) {
        const med = getMedDetails(mentionedMed);
        responses.push(
          `Great question about ${mentionedMed}, ${userName}! 💊\n\n` +
          `Your dosage: ${med.dosage}\n` +
          `Frequency: ${med.frequency}\n` +
          `Time to take: ${med.time}\n\n` +
          `Have you taken it today? Remember: ${med.instructions || 'Follow your doctor\'s instructions carefully.'}`
        );
      } else {
        responses.push(
          `Let me check your medication schedule, ${userName}... 📅\n\n` +
          `You have ${medications.length} medication(s) scheduled:\n` +
          medications.map(m => `• ${m.name} (${m.dosage}) at ${m.time}`).join('\n') +
          `\n\nHave you taken all your medications today?`
        );
      }
    }

    // Food/water questions (specifically for Metformin and Lisinopril)
    if (lowerMsg.includes('eat') || lowerMsg.includes('food') || lowerMsg.includes('breakfast') || lowerMsg.includes('meal')) {
      const hasMetformin = medications.some(m => 
        m.name.toLowerCase().includes('metformin')
      );
      const hasLisinopril = medications.some(m => 
        m.name.toLowerCase().includes('lisinopril')
      );
      
      let response = `Good question about eating, ${userName}! 🍽️\n\n`;
      
      if (hasMetformin) {
        response += `• **Metformin**: Take with food to reduce stomach upset. Have you eaten before taking it today?\n`;
      }
      if (hasLisinopril) {
        response += `• **Lisinopril**: Can be taken with or without food, but being consistent matters.\n`;
      }
      if (!hasMetformin && !hasLisinopril) {
        response += `I notice you don't have Metformin or Lisinopril in your schedule. But generally, it's good to take medications with food unless instructed otherwise.\n`;
      }
      response += `\nHave you been eating regular meals today?`;
      
      responses.push(response);
    }

    if (lowerMsg.includes('water') || lowerMsg.includes('drink') || lowerMsg.includes('hydrate') || lowerMsg.includes('thirsty')) {
      const hasLisinopril = medications.some(m => 
        m.name.toLowerCase().includes('lisinopril')
      );
      
      let response = `Great question about hydration, ${userName}! 💧\n\n`;
      
      if (hasLisinopril) {
        response += `• **Lisinopril** works best when you're well-hydrated. Aim for 8-10 glasses of water daily.\n`;
      }
      response += `• Water helps your body process medications effectively.\n`;
      response += `• It also helps prevent side effects like dizziness.\n\n`;
      response += `How much water have you had today? A good goal is to sip throughout the day.`;
      
      responses.push(response);
    }

    // Side effects
    if (lowerMsg.includes('side effect') || lowerMsg.includes('dizzy') || lowerMsg.includes('nausea') || 
        lowerMsg.includes('headache') || lowerMsg.includes('tired') || lowerMsg.includes('fatigue')) {
      let response = `I'm sorry to hear you're experiencing side effects, ${userName}. 😔\n\n`;
      
      if (mentionedMed) {
        const med = getMedDetails(mentionedMed);
        response += `For ${mentionedMed}:\n`;
        response += `• Common side effects include: nausea, dizziness, headache, fatigue\n`;
        response += `• If side effects are severe, contact your healthcare provider\n`;
        response += `• Sometimes taking with food or at different times can help\n\n`;
      } else {
        response += `Side effects can happen with any medication. Here's what to do:\n`;
        response += `• Keep track of when symptoms occur\n`;
        response += `• Stay hydrated\n`;
        response += `• Rest if you feel dizzy or tired\n`;
        response += `• **Contact your doctor if symptoms are severe or persistent**\n\n`;
      }
      response += `Would you like to track these side effects or discuss them further?`;
      
      responses.push(response);
    }

    // Schedule/reminder
    if (lowerMsg.includes('schedule') || lowerMsg.includes('remind') || lowerMsg.includes('next') || 
        lowerMsg.includes('when') || lowerMsg.includes('time')) {
      if (medications.length > 0) {
        const nextMed = medications
          .filter(m => m.time > new Date().toTimeString().slice(0, 5))
          .sort((a, b) => a.time.localeCompare(b.time))[0];
        
        responses.push(
          `Here's your medication schedule, ${userName}: 📋\n\n` +
          medications.map(m => `• ${m.name}: ${m.dosage} at ${m.time}`).join('\n') +
          (nextMed ? `\n\nYour next medication is **${nextMed.name}** at **${nextMed.time}**.` : '') +
          `\n\nWould you like me to remind you when it's time?`
        );
      } else {
        responses.push(
          `You don't have any medications scheduled yet, ${userName}. 📋\n\nWould you like to add some? You can do this in the Schedule tab.`
        );
      }
    }

    // Emergency/help
    if (lowerMsg.includes('emergency') || lowerMsg.includes('help') || lowerMsg.includes('urgent') || 
        lowerMsg.includes('doctor') || lowerMsg.includes('hospital')) {
      responses.push(
        `⚠️ **Important**: If you're experiencing a medical emergency, please call 911 immediately. 🚨\n\n` +
        `For non-emergency concerns about your medications, contact your healthcare provider or pharmacist.\n\n` +
        `Is there something specific about your medications I can help with?`
      );
    }

    // Goodbye
    if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg.includes('see you')) {
      responses.push(
        `Goodbye, ${userName}! Take care of yourself. 💙\n\n` +
        `Remember to:\n` +
        `• Take your medications as prescribed\n` +
        `• Stay hydrated\n` +
        `• Contact your doctor if you have concerns\n\n` +
        `I'm here if you need anything else!`
      );
    }

    // Default response if no pattern matches
    if (responses.length === 0) {
      responses.push(
        `That's a good question, ${userName}. 🤔\n\n` +
        `I can help you with:\n` +
        `• 💊 Taking your medications\n` +
        `• ⚠️ Side effects\n` +
        `• 💧 Hydration tips\n` +
        `• 🍽️ Food and medication interactions\n` +
        `• 📋 Medication schedule\n\n` +
        `Could you tell me more specifically what you'd like to know?`
      );
    }

    return responses[0]; // Return first matching response
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  // Handle name submission
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNamePrompt(false);
    }
  };

  // Quick reply suggestions
  const quickReplies = [
    { icon: <FaPills />, text: "Check my medications" },
    { icon: <FaUtensils />, text: "When should I eat?" },
    { icon: <FaTint />, text: "Hydration tips" },
    { icon: <FaHeart />, text: "Side effects" },
    { icon: <FaClock />, text: "Schedule" },
    { icon: <FaSmile />, text: "How am I feeling?" }
  ];

  const handleQuickReply = (text) => {
    setInputMessage(text);
    // Auto-send after a brief delay
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      document.querySelector('.chat-form')?.dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="chatbot-view">
      <div className="view-header">
        <h2><span className="header-icon">🤖</span> Medication Assistant</h2>
        <p>Chat with your personal medication assistant for support and guidance</p>
      </div>

      <div className="chat-container">
        {/* Name Prompt */}
        {showNamePrompt && (
          <div className="name-prompt">
            <div className="name-prompt-content">
              <FaRobot className="name-prompt-icon" />
              <h3>Welcome to MediTrack Assistant! 👋</h3>
              <p>I'm here to help you manage your medications, track side effects, and stay healthy.</p>
              <form onSubmit={handleNameSubmit} className="name-form">
                <input
                  type="text"
                  placeholder="What's your name?"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="name-input"
                  required
                />
                <button type="submit" className="name-submit-btn">
                  Start Chat <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {!showNamePrompt && (
          <>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-avatar">
                    {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      {message.text.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < message.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message bot-message">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply.text)}
                >
                  {reply.icon} {reply.text}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="chat-form">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="chat-input"
                disabled={isTyping}
              />
              <button type="submit" className="chat-send-btn" disabled={isTyping || !inputMessage.trim()}>
                <FaPaperPlane />
              </button>
            </form>
          </>
        )}
      </div>

      {/* Info Banner */}
      <div className="chatbot-info">
        <div className="info-item">
          <span>💡</span>
          <span>Ask me about medication schedules, side effects, and wellness tips</span>
        </div>
        <div className="info-item">
          <span>⚠️</span>
          <span>Always consult your healthcare provider for medical advice</span>
        </div>
      </div>
    </div>
  );
}

export default ChatbotView;
