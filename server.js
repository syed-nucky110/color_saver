/**
 * ShadeSphere AI Theme Generator Backend
 * Node.js + Express server with ChatGPT API integration
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'theme-generator.html'));
});

// AI Theme Generation Endpoint
app.post('/api/apply-theme', async (req, res) => {
    try {
        const { colors, instruction } = req.body;
        
        // Validate input
        if (!colors || !Array.isArray(colors) || colors.length < 4) {
            return res.status(400).json({
                error: 'Invalid input: Please provide at least 4 colors'
            });
        }
        
        // Validate color formats
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const invalidColors = colors.filter(color => !colorRegex.test(color));
        
        if (invalidColors.length > 0) {
            return res.status(400).json({
                error: `Invalid color format: ${invalidColors.join(', ')}`
            });
        }
        
        console.log(`🎨 AI Theme Request: ${colors.length} colors provided`);
        console.log(`Colors: ${colors.join(', ')}`);
        
        // Try to call ChatGPT API
        let themeMapping;
        
        if (process.env.OPENAI_API_KEY) {
            try {
                themeMapping = await callChatGPTAPI(colors, instruction);
                console.log('✅ ChatGPT API response received');
            } catch (apiError) {
                console.error('❌ ChatGPT API failed:', apiError.message);
                themeMapping = generateFallbackTheme(colors);
                console.log('🔄 Using fallback theme');
            }
        } else {
            console.log('⚠️ No OpenAI API key found, using fallback theme');
            themeMapping = generateFallbackTheme(colors);
        }
        
        // Validate and clean the response
        const cleanedMapping = validateAndCleanThemeMapping(themeMapping, colors);
        
        console.log('🎯 Final theme mapping:', cleanedMapping);
        
        res.json(cleanedMapping);
        
    } catch (error) {
        console.error('❌ Server error:', error);
        
        // Return fallback theme on any error
        const fallbackMapping = generateFallbackTheme(req.body.colors || ['#4285F4', '#34A853', '#ffffff', '#212121']);
        
        res.status(200).json(fallbackMapping);
    }
});

// Call ChatGPT API
async function callChatGPTAPI(colors, instruction) {
    const fetch = (await import('node-fetch')).default;
    
    const prompt = `You are a professional UI/UX assistant. The user has provided these colors: ${colors.join(', ')}. 

${instruction}

Requirements:
- Assign colors to: header, footer, background, text, button, link
- Ensure good contrast ratios for accessibility
- Consider color psychology and web design best practices
- Return ONLY a valid JSON object with the mapping
- Do not include any explanations or additional text

Example format:
{
  "header": "#4285F4",
  "footer": "#34A853", 
  "background": "#ffffff",
  "text": "#212121",
  "button": "#EA4335",
  "link": "#4285F4"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional UI/UX color expert. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 200,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Try to parse JSON from the response
    try {
        // Remove any markdown code blocks if present
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (parseError) {
        console.error('Failed to parse ChatGPT response:', content);
        throw new Error('Invalid JSON response from ChatGPT');
    }
}

// Generate fallback theme when API fails
function generateFallbackTheme(colors) {
    console.log('🔄 Generating fallback theme assignment');
    
    // Smart fallback logic based on color luminance
    const colorData = colors.map(color => ({
        color: color,
        luminance: calculateLuminance(color),
        hue: getHue(color)
    }));
    
    // Sort by luminance (darkest to lightest)
    colorData.sort((a, b) => a.luminance - b.luminance);
    
    const darkest = colorData[0].color;
    const lightest = colorData[colorData.length - 1].color;
    const midTones = colorData.slice(1, -1);
    
    // Intelligent assignment
    const mapping = {
        background: lightest, // Lightest for background
        text: darkest, // Darkest for text (best contrast)
        header: midTones[0]?.color || colors[0], // First mid-tone or fallback
        footer: midTones[1]?.color || colors[1] || colors[0], // Second mid-tone or fallback
        button: colors[0], // User's first color choice
        link: colors[1] || colors[0] // User's second color or fallback
    };
    
    return mapping;
}

// Calculate color luminance
function calculateLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Get hue from hex color
function getHue(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff === 0) return 0;
    
    let hue;
    switch (max) {
        case r: hue = (g - b) / diff + (g < b ? 6 : 0); break;
        case g: hue = (b - r) / diff + 2; break;
        case b: hue = (r - g) / diff + 4; break;
    }
    
    return hue * 60;
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Validate and clean theme mapping
function validateAndCleanThemeMapping(mapping, originalColors) {
    const requiredKeys = ['header', 'footer', 'background', 'text', 'button', 'link'];
    const cleanedMapping = {};
    
    requiredKeys.forEach(key => {
        if (mapping[key] && isValidHexColor(mapping[key])) {
            cleanedMapping[key] = mapping[key];
        } else {
            // Fallback to original colors if mapping is invalid
            const fallbackIndex = requiredKeys.indexOf(key) % originalColors.length;
            cleanedMapping[key] = originalColors[fallbackIndex];
        }
    });
    
    return cleanedMapping;
}

// Validate hex color format
function isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 ShadeSphere AI Theme Generator Server Started');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🎨 Theme Generator: http://localhost:${PORT}/theme-generator.html`);
    console.log(`🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not configured (using fallback)'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

module.exports = app;