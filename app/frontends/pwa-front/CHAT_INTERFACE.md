# Chat Interface - Iza Chatbot

## ✅ Simple Chat Page Created

A clean, modern chat interface with Iza, the virtual assistant for Participa DF.

## 🎨 Features

### Chat Interface
- **Welcome Message**: Iza greets users automatically with: "Olá! Eu sou a Iza, assistente virtual do Participa DF. Como posso ajudá-lo hoje?"
- **Real-time Messaging**: Send and receive messages instantly
- **Auto-Response**: Bot responds automatically after 1 second
- **Timestamps**: Shows time in Brazilian format (HH:MM)
- **Keyboard Support**: Press Enter to send messages
- **Visual Distinction**: 
  - User messages: Right side with primary color background
  - Bot messages: Left side with muted background
- **Avatar Display**: "IZ" avatar shown with bot messages

### UI Design

```
┌─────────────────────────────────────────┐
│ [IZ] Iza - Assistente Virtual          │
│      Participa DF • Ouvidoria Digital   │
├─────────────────────────────────────────┤
│                                         │
│ [IZ] Olá! Eu sou a Iza...              │
│      10:30                              │
│                                         │
│                  Olá, Iza! [USER]      │
│                           10:31         │
│                                         │
│ [IZ] Obrigada pela...                  │
│      10:32                              │
│                                         │
├─────────────────────────────────────────┤
│ [Digite sua mensagem...] [📤]          │
└─────────────────────────────────────────┘
```

## 🎯 Components Used

### From shadcn/ui
- `Button` - Send message button with icon
- `Card` - Main chat container
- `Input` - Message input field

### From lucide-react
- `Send` - Send icon

## 💬 Message Structure

```typescript
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
```

## 🎨 Styling

- **Responsive Design**: Full-width on mobile, max-width 2xl on desktop
- **Fixed Height**: 600px chat window
- **Flex Layout**: Header, messages, and input properly distributed
- **Color Scheme**:
  - Header: Primary background with white text
  - User messages: Primary color
  - Bot messages: Muted background
  - Avatar: Primary with white text
  - Input area: Muted background

## 🌐 Internationalization (PT-BR)

All text is in Brazilian Portuguese:
- Welcome message: "Olá! Eu sou a Iza, assistente virtual do Participa DF..."
- Input placeholder: "Digite sua mensagem..."
- Bot responses: Portuguese text
- Time format: PT-BR (HH:MM)

## 📦 Build Results

```
✓ Built in 1.12s
CSS: 63.45 kB (10.95 kB gzipped)
JS: 228.74 kB (72.25 kB gzipped)
```

## 🚀 How to Run

```bash
# Development mode
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

## 🎯 Key Functions

### `handleSendMessage()`
- Validates input (non-empty)
- Adds user message to chat
- Clears input field
- Triggers bot response after 1 second

### `handleKeyPress()`
- Enables Enter key to send messages
- Improves user experience

## 🔮 Future Enhancements

Potential improvements:
1. Connect to real AI/chatbot backend API
2. Add typing indicators
3. Add message reactions/emojis
4. Add file/image upload
5. Add message history persistence (localStorage/database)
6. Add more contextual bot responses
7. Add quick reply buttons
8. Add voice input
9. Add message search functionality
10. Add chat themes/customization
11. Add read receipts
12. Add notification sounds

## 🎉 Status

✅ **Simple chat interface complete and ready to use!**

The interface includes:
- ✅ Clean, modern design
- ✅ Iza chatbot with welcome message
- ✅ Functional message sending
- ✅ Auto-responses
- ✅ Beautiful UI with shadcn/ui components
- ✅ Responsive design
- ✅ Dark mode support
- ✅ PWA ready

---

**Built with React + TypeScript + Tailwind CSS + shadcn/ui**
