
import React from 'react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
    message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                    AI
                </div>
            )}
            <div
                className={`max-w-md rounded-xl p-3 shadow-sm ${
                    isUser
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                }`}
            >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};

export default ChatMessageBubble;
