
  document.addEventListener('DOMContentLoaded', function() {
    // Create the main container
    const asraContainer = document.createElement('div');
    asraContainer.id = 'asra-container';
    asraContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    // Create the chat box
    const chatBox = document.createElement('div');
    chatBox.id = 'asra-chatbox';
    chatBox.style.cssText = `
        width: 365px;
        height: 450px;
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        display: none;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(30px) scale(0.9);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = `
        background: linear-gradient(90deg, #0f3460 0%, #533483 100%);
        color: white;
        padding: 18px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
    `;
    
    const headerTitle = document.createElement('div');
    headerTitle.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        font-size: 18px;
    `;
    
    const botIcon = document.createElement('img');
    botIcon.src = 'https://raw.githubusercontent.com/mahendraplus/mahendraplus.github.io/refs/heads/Mahendra-Mali/assets/img/bot/asra.jpg';
    botIcon.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    `;
    
    const botName = document.createElement('span');
    botName.textContent = 'Asra AI';
    botName.style.color = '#fff';
    
    headerTitle.appendChild(botIcon);
    headerTitle.appendChild(botName);
    
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        cursor: pointer;
        font-size: 24px;
        opacity: 0.7;
        transition: all 0.2s;
        padding: 5px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.7';
        closeBtn.style.background = 'transparent';
    });
    closeBtn.addEventListener('click', toggleChat);
    
    chatHeader.appendChild(headerTitle);
    chatHeader.appendChild(closeBtn);
    
    // Chat messages area
    const chatMessages = document.createElement('div');
    chatMessages.id = 'asra-messages';
    chatMessages.style.cssText = `
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
        background-color: rgba(10, 10, 20, 0.5);
    `;
    
    // Welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.style.cssText = `
        background: linear-gradient(135deg, #533483 0%, #0f3460 100%);
        padding: 14px 18px;
        border-radius: 18px 18px 18px 4px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        max-width: 85%;
        align-self: flex-start;
        font-size: 14px;
        color: #fff;
        line-height: 1.5;
        animation: fadeInUp 0.4s ease-out;
    `;
    welcomeMessage.innerHTML = `
        <strong>Asra AI:</strong> Hello! I'm Asra, your personal AI assistant. May I know your name?`;
    chatMessages.appendChild(welcomeMessage);
    
    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
        padding: 15px 20px;
        background: rgba(15, 20, 40, 0.8);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        gap: 10px;
        position: relative;
    `;
    
    const messageInput = document.createElement('textarea');
    messageInput.id = 'asra-input';
    messageInput.placeholder = 'Type your message...';
    messageInput.style.cssText = `
        flex: 1;
        padding: 14px 18px;
        border: none;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
        transition: all 0.3s;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        resize: none;
        min-height: 20px;
        max-height: 100px;
        backdrop-filter: blur(10px);
    `;
    messageInput.addEventListener('focus', () => {
        messageInput.style.background = 'rgba(255, 255, 255, 0.15)';
        messageInput.style.boxShadow = '0 0 0 2px rgba(83, 52, 131, 0.5)';
    });
    messageInput.addEventListener('blur', () => {
        messageInput.style.background = 'rgba(255, 255, 255, 0.1)';
        messageInput.style.boxShadow = 'none';
    });
    
    // Auto-expanding textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    const sendBtn = document.createElement('button');
    sendBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    sendBtn.style.cssText = `
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `;
    sendBtn.addEventListener('mouseenter', () => {
        sendBtn.style.opacity = '0.9';
        sendBtn.style.transform = 'scale(1.05)';
        sendBtn.style.boxShadow = '0 5px 15px rgba(83, 52, 131, 0.4)';
    });
    sendBtn.addEventListener('mouseleave', () => {
        sendBtn.style.opacity = '1';
        sendBtn.style.transform = 'scale(1)';
        sendBtn.style.boxShadow = 'none';
    });
    sendBtn.addEventListener('click', sendMessage);
    
    // Press Enter to send (but allow Shift+Enter for new lines)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    inputArea.appendChild(messageInput);
    inputArea.appendChild(sendBtn);
    
    // Footer with powered by text
    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
        text-align: center;
        display: flex;
        justify-content: space-between;
    `;
    
    const poweredBy = document.createElement('div');
    poweredBy.textContent = 'Powered by mahendraplus.github.io 2024-2025';
    
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'asra-loading';
    loadingIndicator.style.cssText = `
        display: none;
        align-items: center;
        gap: 5px;
        color: rgba(255, 255, 255, 0.6);
    `;
    loadingIndicator.innerHTML = `
        <span style="display: flex; gap: 3px;">
            <span class="loading-dot" style="animation-delay: 0s"></span>
            <span class="loading-dot" style="animation-delay: 0.2s"></span>
            <span class="loading-dot" style="animation-delay: 0.4s"></span>
        </span>
        Thinking...
    `;
    
    footer.appendChild(poweredBy);
    footer.appendChild(loadingIndicator);
    
    // Assemble chat box
    chatBox.appendChild(chatHeader);
    chatBox.appendChild(chatMessages);
    chatBox.appendChild(inputArea);
    chatBox.appendChild(footer);
    
    // Create floating button
    const floatingBtn = document.createElement('div');
    floatingBtn.id = 'asra-floating-btn';
    floatingBtn.style.cssText = `
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(15, 52, 96, 0.4);
        position: relative;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    floatingBtn.addEventListener('mouseenter', () => {
        floatingBtn.style.transform = 'scale(1.1)';
        floatingBtn.style.boxShadow = '0 15px 40px rgba(15, 52, 96, 0.6)';
    });
    floatingBtn.addEventListener('mouseleave', () => {
        floatingBtn.style.transform = 'scale(1)';
        floatingBtn.style.boxShadow = '0 10px 30px rgba(15, 52, 96, 0.4)';
    });
    floatingBtn.addEventListener('click', toggleChat);
    
    // Add chat bubble with greeting
    const chatBubble = document.createElement('div');
    chatBubble.style.cssText = `
        position: absolute;
        top: -15px;
        left: -15px;
        background: white;
        color: #533483;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.3s ease;
        pointer-events: none;
        white-space: nowrap;
    `;
    chatBubble.textContent = 'Hi..👋';
    
    // Show bubble after a delay
    setTimeout(() => {
        chatBubble.style.opacity = '1';
        chatBubble.style.transform = 'scale(1)';
    }, 2000);
    
    // Hide bubble after some time
    setTimeout(() => {
        chatBubble.style.opacity = '0';
        chatBubble.style.transform = 'scale(0.5)';
    }, 6000);
    
    floatingBtn.appendChild(chatBubble);
    
    // Add bot icon to floating button
    const btnIcon = document.createElement('img');
    btnIcon.src = 'https://raw.githubusercontent.com/mahendraplus/mahendraplus.github.io/refs/heads/Mahendra-Mali/assets/img/bot/asra.jpg';
    btnIcon.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s;
    `;
    floatingBtn.appendChild(btnIcon);
    
    // Add pulse animation
    const pulse = document.createElement('div');
    pulse.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(83, 52, 131, 0.4);
        animation: pulse 2s infinite;
        z-index: -1;
    `;
    floatingBtn.appendChild(pulse);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(0.95);
                opacity: 0.7;
            }
            70% {
                transform: scale(1.3);
                opacity: 0;
            }
            100% {
                transform: scale(0.95);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .asra-message {
            background: linear-gradient(135deg, rgba(83, 52, 131, 0.2) 0%, rgba(15, 52, 96, 0.2) 100%);
            padding: 14px 18px;
            border-radius: 18px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            max-width: 85%;
            font-size: 14px;
            color: #fff;
            animation: fadeInUp 0.4s ease-out;
            line-height: 1.5;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .asra-user-message {
            align-self: flex-end;
            background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
            color: white;
            border-radius: 18px 18px 4px 18px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .asra-bot-message {
            align-self: flex-start;
            border-radius: 18px 18px 18px 4px;
        }
        
        #asra-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        #asra-messages::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
        }
        
        #asra-messages::-webkit-scrollbar-thumb {
            background: rgba(83, 52, 131, 0.5);
            border-radius: 3px;
        }
        
        #asra-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(83, 52, 131, 0.7);
        }
        
        .gender-selection {
            display: flex;
            gap: 10px;
            margin-top: 12px;
        }
        
        .gender-btn {
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 5px;
            backdrop-filter: blur(5px);
        }
        
        .gender-btn:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        .gender-btn.selected {
            background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
            color: white;
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(5px);
        }
        
        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .user-info {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .user-info strong {
            color: white;
            font-weight: 600;
        }
        
        .user-info small {
            display: block;
            font-size: 11px;
            opacity: 0.7;
        }
        
        .loading-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            animation: loadingPulse 1.4s infinite ease-in-out;
        }
        
        @keyframes loadingPulse {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
            30% { transform: translateY(-3px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Assemble container
    asraContainer.appendChild(chatBox);
    asraContainer.appendChild(floatingBtn);
    document.body.appendChild(asraContainer);
    
    // State variables
    let userName = '';
    let userLocation = '';
    let userGender = '';
    let conversationStage = 'askName'; // askName -> askLocation -> askGender -> normal
    let conversationHistory = [];
    
    // Knowledge base about Mahendra Mali
    const mahendraKnowledge = {
        about: "Mahendra Mali is a passionate, self-taught developer specializing in Android apps and IoT solutions. He collaborates with digital agencies to bring innovative ideas to life. With a strong background in cybersecurity and Linux development, he delivers results that drive impact.",
        skills: [
            "Web Design: Creates modern, high-quality web designs",
            "Web Development: Builds responsive, fast, and secure websites",
            "Mobile App Development: Specializes in Android app development",
            "Cybersecurity: Provides top-notch cybersecurity solutions",
            "IoT and Robotics: Creates IoT and robotics solutions",
            "Electronic Solutions: Designs IC circuits and embedded systems",
            "Networking: Builds and manages reliable networks",
            "Server Management: Ensures optimal server performance",
            "Photography: Provides professional photography services",
            "Video Editing: Specializes in editing short videos"
        ],
        education: [
            "Master of Computer Applications (MCA) - Ongoing at Sankalchand Patel University",
            "Bachelor of Computer Applications (BCA) - Hemchandracharya North Gujarat University",
            "12th Grade (Science Stream) - 51.69%",
            "10th Grade - 92.37 percentile"
        ],
        experience: [
            "CEO and Co-Founder of MaxFit Gym Application (2023-2024)",
            "Server Management at Gujarat Sachivalay Gandhinagar (2022-2023)",
            "Web Design and Office Assistant at RDSDE Gandhinagar (2018-2019)"
        ],
        projects: [
            "MAX FIT: Fitness technology project",
            "MAXTER: Likely involving terminal or system-level utilities",
            "B4Bomber: Experimental project possibly related to cybersecurity testing"
        ],
        website: "mahendraplus.github.io hosts various projects including Android experiments, IoT firmware, offline micro web projects, PDFs, code resources, and demos."
    };
    
    // Toggle chat function
    function toggleChat() {
        const chatBox = document.getElementById('asra-chatbox');
        const floatingBtn = document.getElementById('asra-floating-btn');
        
        if (chatBox.style.display === 'flex') {
            chatBox.style.opacity = '0';
            chatBox.style.transform = 'translateY(30px) scale(0.9)';
            setTimeout(() => {
                chatBox.style.display = 'none';
            }, 400);
            floatingBtn.style.display = 'flex';
        } else {
            chatBox.style.display = 'flex';
            setTimeout(() => {
                chatBox.style.opacity = '1';
                chatBox.style.transform = 'translateY(0) scale(1)';
            }, 10);
            floatingBtn.style.display = 'none';
        }
        
        // Focus input when chat opens
        if (chatBox.style.display === 'flex') {
            setTimeout(() => {
                document.getElementById('asra-input').focus();
            }, 450);
        }
    }
    
    // Send message function
    function sendMessage() {
        const input = document.getElementById('asra-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto'; // Reset textarea height
        
        // Process the message
        processUserMessage(message);
    }
    
    // Process user message
    function processUserMessage(message) {
        const messagesContainer = document.getElementById('asra-messages');
        
        // Show typing indicator
        document.getElementById('asra-loading').style.display = 'flex';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate thinking delay
        setTimeout(() => {
            // Remove typing indicator
            document.getElementById('asra-loading').style.display = 'none';
            
            // Handle conversation flow
            switch (conversationStage) {
                case 'askName':
                    userName = message;
                    conversationStage = 'askLocation';
                    addMessage(`Nice to meet you, ${userName}! Where are you from?`, 'bot');
                    break;
                    
                case 'askLocation':
                    userLocation = message;
                    conversationStage = 'askGender';
                    
                    // Ask for gender with buttons
                    const genderMessage = document.createElement('div');
                    genderMessage.className = 'asra-message asra-bot-message';
                    genderMessage.innerHTML = `
                        <strong>Asra AI:</strong> Thanks, ${userName} from ${userLocation}! How should I refer to you?
                        <div class="gender-selection">
                            <button class="gender-btn" onclick="selectGender('male')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 15C10 12.7909 11.7909 11 14 11C16.2091 11 18 12.7909 18 15C18 17.2091 16.2091 19 14 19C11.7909 19 10 17.2091 10 15Z" stroke="currentColor" stroke-width="2"/>
                                    <path d="M14 15V3M14 3L17 6M14 3L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Male
                            </button>
                            <button class="gender-btn" onclick="selectGender('female')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 15C14 12.7909 15.7909 11 18 11C20.2091 11 22 12.7909 22 15C22 17.2091 20.2091 19 18 19C15.7909 19 14 17.2091 14 15Z" stroke="currentColor" stroke-width="2"/>
                                    <path d="M18 15V3M18 3L21 6M18 3L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <circle cx="6" cy="9" r="3" stroke="currentColor" stroke-width="2"/>
                                    <path d="M6 12V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                Female
                            </button>
                        </div>
                    `;
                    messagesContainer.appendChild(genderMessage);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    break;
                    
                case 'askGender':
                    // Wait for gender selection via buttons
                    return;
                    
                case 'normal':
                    // Handle normal conversation
                    const response = generateResponse(message);
                    addMessage(response, 'bot');
                    break;
            }
        }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
    }
    
    // Select gender function
    window.selectGender = function(gender) {
        userGender = gender;
        conversationStage = 'normal';
        
        // Update UI
        const genderButtons = document.querySelectorAll('.gender-btn');
        genderButtons.forEach(btn => {
            btn.classList.remove('selected');
            if ((gender === 'male' && btn.textContent.includes('Male')) || 
                (gender === 'female' && btn.textContent.includes('Female'))) {
                btn.classList.add('selected');
            }
        });
        
        // Show avatar
        showUserAvatar(gender);
        
        // Send welcome message
        setTimeout(() => {
            addMessage(`Great! Now I can assist you better, ${userName}. How can I help you today? You can ask about Mahendra's projects, Android development, IoT systems, Linux customization, or anything else!`, 'bot');
        }, 500);
    };
    
    // Show user avatar
    function showUserAvatar(gender) {
        const messagesContainer = document.getElementById('asra-messages');
        
        // Find existing profile or create new
        let profile = document.querySelector('.user-profile');
        if (!profile) {
            profile = document.createElement('div');
            profile.className = 'user-profile';
            
            const avatar = document.createElement('img');
            avatar.className = 'user-avatar';
            avatar.src = gender === 'male' ? 
                'https://i.imgur.com/JQ9wDgG.png' : // Male avatar
                'https://i.imgur.com/JQ9wDgG.png';  // Female avatar (same for demo)
            
            const info = document.createElement('div');
            info.className = 'user-info';
            info.innerHTML = `<strong>${userName}</strong><small>${userLocation}</small>`;
            
            profile.appendChild(avatar);
            profile.appendChild(info);
            
            // Insert after the last message
            const lastMessage = messagesContainer.lastChild;
            messagesContainer.insertBefore(profile, lastMessage.nextSibling);
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('asra-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('asra-message', `asra-${sender}-message`);
        
        if (sender === 'user') {
            messageElement.innerHTML = `<strong>You:</strong> ${text}`;
        } else {
            messageElement.innerHTML = `<strong>Asra AI:</strong> ${text}`;
        }
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to conversation history
        conversationHistory.push({
            sender: sender === 'user' ? 'user' : 'bot',
            message: text,
            timestamp: new Date().toISOString()
        });
    }
    
    // Generate intelligent response
    function generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Greetings
        if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
            return `Hello ${userName}! How can I assist you with Mahendra's projects today?`;
        }
        
        // About Mahendra
        if (lowerMsg.includes('who is mahendra') || lowerMsg.includes('about mahendra') || lowerMsg.includes('tell me about mahendra')) {
            return mahendraKnowledge.about;
        }
        
        // Skills
        if (lowerMsg.includes('skill') || lowerMsg.includes('expertise') || lowerMsg.includes('what can mahendra do')) {
            return `Mahendra has expertise in:\n\n- ${mahendraKnowledge.skills.join('\n- ')}`;
        }
        
        // Education
        if (lowerMsg.includes('education') || lowerMsg.includes('degree') || lowerMsg.includes('study')) {
            return `Mahendra's education background:\n\n- ${mahendraKnowledge.education.join('\n- ')}`;
        }
        
        // Experience
        if (lowerMsg.includes('experience') || lowerMsg.includes('work') || lowerMsg.includes('job')) {
            return `Mahendra's professional experience:\n\n- ${mahendraKnowledge.experience.join('\n- ')}`;
        }
        
        // Projects
        if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('maxfit') || lowerMsg.includes('maxter') || lowerMsg.includes('b4bomber')) {
            return `Mahendra's notable projects include:\n\n- ${mahendraKnowledge.projects.join('\n- ')}\n\nYou can find more on his website: ${mahendraKnowledge.website}`;
        }
        
        // Website
        if (lowerMsg.includes('website') || lowerMsg.includes('site') || lowerMsg.includes('mahendraplus')) {
            return mahendraKnowledge.website;
        }
        
        // Android projects
        if (lowerMsg.includes('android') || lowerMsg.includes('apk') || lowerMsg.includes('magisk') || lowerMsg.includes('root')) {
            return `Mahendra works on various Android projects including:\n- Custom APK creation\n- Launcher customization\n- Root tools and Magisk setups\n- Play Integrity bypass techniques\n- System app modifications\n\nCheck out the Android section on his website for more details.`;
        }
        
        // IoT projects
        if (lowerMsg.includes('iot') || lowerMsg.includes('esp32') || lowerMsg.includes('nodemcu') || lowerMsg.includes('micropython')) {
            return `Mahendra's IoT projects often involve:\n- ESP32/NodeMCU with MicroPython\n- Captive portals and DNS redirection\n- SD-card-based web servers\n- Embedded device management panels\n- Real-time control systems\n\nThese projects showcase creative solutions using minimal resources.`;
        }
        
        // Linux
        if (lowerMsg.includes('linux') || lowerMsg.includes('arch') || lowerMsg.includes('ubuntu') || lowerMsg.includes('server')) {
            return `Mahendra uses Linux (mainly Arch and Ubuntu) for:\n- System performance optimization\n- Security and hacking research\n- Server hosting and configuration\n- Command-line tool development\n\nHis projects often involve creative server setups and system tweaks.`;
        }
        
        // Help
        if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('what can you do')) {
            return `I can help you with information about:\n- Mahendra's background and skills\n- His Android projects (APKs, Magisk, root)\n- IoT systems (ESP32, NodeMCU, MicroPython)\n- Linux customization and servers\n- Specific projects like MAXTER, maxfit, B4Bomber\n\nJust ask about what interests you!`;
        }
        
        // Default response
        const defaultResponses = [
            `I'm not sure I understand. Could you rephrase that, ${userName}?`,
            `That's an interesting question! Could you provide more details?`,
            `I'm designed to help with technical questions about Mahendra's projects. Could you ask something more specific?`,
            `Mahendra works on many different projects. Could you clarify which area you're interested in?`,
            `I'm still learning! Try asking about Android, IoT, Linux, or Mahendra's specific projects.`
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Expose functions to window
    window.toggleAsraChat = toggleChat;
    window.sendAsraMessage = sendMessage;
});
