import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const SpeechRecognition = 
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const mic = SpeechRecognition ? new SpeechRecognition() : null;

if (mic) {
  mic.continuous = true;
  mic.interimResults = true;
  mic.lang = 'en-US';
}

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Creating theme for light and dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#fff', // Full-screen background color
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000', // Text color for dark and light modes
      },
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
    },
  });

  useEffect(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => mic.start(); // Auto-restart for continuous listening
    } else {
      mic?.stop();
      mic.onend = () => console.log("Mic stopped");
    }

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setNote(transcript);
    };

    mic.onerror = (event) => console.error(event.error);

    return () => mic?.stop(); // Clean up when component unmounts
  }, [isListening]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures full-screen dark mode */}
      <Container 
        maxWidth="sm" 
        style={{ 
          marginTop: '50px', 
          textAlign: 'center', 
          backgroundColor: darkMode ? '#121212' : '#fff', // Container background
          color: darkMode ? '#fff' : '#000',  // Text color in container
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        {/* Light/Dark Mode Toggle Button */}
        <IconButton 
          onClick={() => setDarkMode(!darkMode)} 
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />} {/* Swap icons */}
        </IconButton>

        <Typography variant="h3" gutterBottom>
          Voice to Text Converter
        </Typography>
        
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          flexDirection="column"
          style={{ marginBottom: '20px' }}
        >
          <Typography variant="h6" gutterBottom>
            {isListening ? 'Listening...' : 'Click to Start'}
          </Typography>
          <Typography 
            variant="body1" 
            style={{
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '10px',
              minHeight: '100px',
              width: '100%',
              fontSize: '1.2rem',
              lineHeight: '1.5',
              backgroundColor: darkMode ? '#333' : '#f9f9f9', // Adjusted for dark mode readability
              color: darkMode ? '#fff' : '#000', // Adjusted text color for readability
            }}
          >
            {note || "Your speech will appear here..."}
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="center" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setIsListening(true)}
            startIcon={<MicIcon />}
            disabled={isListening}
          >
            Start
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => setIsListening(false)}
            startIcon={<StopIcon />}
            disabled={!isListening}
          >
            Stop
          </Button>
          <Button 
            variant="outlined" 
            color="default" 
            onClick={() => setIsListening(prev => !prev)}
            startIcon={isListening ? <PauseIcon /> : <MicIcon />}
          >
            {isListening ? 'Pause' : 'Continue'}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
