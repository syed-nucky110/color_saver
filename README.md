# 🎨 ShadeSphere AI Theme Generator

An intelligent theme generator that uses AI to automatically assign colors to different website sections for optimal design and accessibility.

## ✨ Features

- **AI-Powered Color Assignment**: ChatGPT intelligently assigns colors to header, footer, background, text, buttons, and links
- **Dynamic Color Input**: Add unlimited colors with intuitive color pickers and text inputs
- **Live Preview**: Professional website layout that updates in real-time
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Fallback System**: Smart fallback theme generation when AI service is unavailable
- **Export Functionality**: Save your AI-generated themes as JSON files

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- OpenAI API key (optional - fallback works without it)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. **Start the Server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Open in Browser**
   ```
   http://localhost:3000/theme-generator.html
   ```

## 🎯 How to Use

1. **Select Colors**: Use the sidebar to input at least 4 colors (minimum required)
2. **Add More Colors**: Click "+ Add More Colors" to include additional colors in your palette
3. **Generate Theme**: Click "🤖 Apply AI Theme" to let AI assign colors intelligently
4. **View Results**: See your theme applied instantly in the professional preview layout
5. **Export**: Save your generated theme for use in other projects

## 🔧 API Endpoints

### `POST /api/apply-theme`
Generate AI-powered theme from color palette.

**Request Body:**
```json
{
  "colors": ["#FF5733", "#3498DB", "#F1C40F", "#2ECC71"],
  "instruction": "Assign each color intelligently to the best suited section of a professional website layout"
}
```

**Response:**
```json
{
  "header": "#3498DB",
  "footer": "#2ECC71", 
  "background": "#F1C40F",
  "text": "#000000",
  "button": "#FF5733",
  "link": "#3498DB"
}
```

### `GET /api/health`
Check server status and configuration.

## 🎨 Color Assignment Logic

The AI considers multiple factors when assigning colors:

- **Contrast Ratios**: Ensures text readability and accessibility compliance
- **Color Psychology**: Applies appropriate colors based on their psychological impact
- **Design Principles**: Follows established UI/UX best practices
- **Brand Consistency**: Maintains visual harmony across all elements

## 🛠️ Technical Architecture

### Frontend
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern responsive design with CSS variables
- **Vanilla JavaScript**: Simple function-based architecture (no frameworks)

### Backend  
- **Node.js + Express**: RESTful API server
- **OpenAI Integration**: ChatGPT API for intelligent color assignment
- **Fallback System**: Smart algorithm when AI service is unavailable

### Key Files
```
├── theme-generator.html    # Main application page
├── theme-generator.css     # Responsive styles and themes
├── theme-generator.js      # Frontend logic and API calls
├── server.js              # Express server with AI integration
├── package.json           # Dependencies and scripts
└── .env.example          # Environment variables template
```

## ⚙️ Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for ChatGPT integration
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Fallback Theme
When the AI service is unavailable, the system uses an intelligent fallback algorithm that:
- Analyzes color luminance and contrast ratios
- Assigns darkest colors to text for readability
- Uses lightest colors for backgrounds
- Distributes mid-tones to headers and footers

## 🎮 Keyboard Shortcuts

- `Ctrl/Cmd + T`: Toggle sidebar
- `Ctrl/Cmd + +`: Add new color input
- `Ctrl/Cmd + Enter`: Apply AI theme (when in color input)
- `Esc`: Close sidebar (mobile)

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Full sidebar + preview)
- **Tablet**: 768px - 1024px (Optimized layout)
- **Mobile**: < 768px (Collapsible sidebar)
- **Small Mobile**: < 480px (Stacked inputs)

## 🚧 Error Handling

The application includes comprehensive error handling:

- **Input Validation**: Checks color format and minimum requirements
- **API Failures**: Graceful fallback to local algorithm
- **Network Issues**: User-friendly error messages
- **Invalid Colors**: Real-time validation with visual feedback

## 🎯 Future Enhancements

- [ ] Multiple AI provider support (GPT-4, Claude, etc.)
- [ ] Color palette suggestions based on trends
- [ ] Accessibility score calculation
- [ ] Integration with design tools (Figma, Sketch)
- [ ] Theme marketplace and sharing
- [ ] Advanced color theory analysis

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

---

**Made with ❤️ by the ShadeSphere Team**