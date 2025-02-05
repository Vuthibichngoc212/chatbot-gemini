/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const ChatBox = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { type: string; message: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  const handleUserInput = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleClick = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      let chat = chatSession;

      // Nếu chưa có phiên trò chuyện, khởi tạo `startChat()`
      if (!chat) {
        chat = model.startChat({
          history: chatHistory.map((msg) => ({
            role: msg.type === "user" ? "user" : "model",
            parts: [{ text: msg.message }],
          })),
        });
        setChatSession(chat);
      }

      // Gửi tin nhắn mới đến Gemini
      const result = await chat.sendMessage(userInput);
      // Lấy phản hồi từ Gemini
      const responseText = result.response.candidates[0].content.parts[0].text;
      // Cập nhật lịch sử hội thoại
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "user", message: userInput },
        { type: "bot", message: responseText },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Card style={{ minWidth: 400, padding: 24, background: "#e5e6e685" }}>
        <CardHeader
          title="Tôi có thể giúp gì cho bạn?"
          style={{ textAlign: "center" }}
        />
        <CardContent sx={{ padding: 0 }}>
          {chatHistory.length > 0 && (
            <Paper
              sx={{
                padding: 2,
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
                backgroundColor: "white",
                textAlign: "left",
                mb: 2,
              }}
            >
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  style={{ textAlign: msg.type === "user" ? "right" : "left" }}
                >
                  <p
                    style={{
                      display: "inline-block",
                      padding: "8px",
                      borderRadius: "10px",
                      background: msg.type === "user" ? "#007bff" : "#e5e5e5",
                      color: msg.type === "user" ? "white" : "black",
                      marginBottom: "5px",
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              ))}
            </Paper>
          )}

          <TextField
            fullWidth
            placeholder="Nhắn tin cho ChatGPT"
            value={userInput}
            onChange={handleUserInput}
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-input": {
                padding: "6px 12px",
              },
            }}
          />
        </CardContent>
        <Button
          fullWidth
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            margin: "15px 0px",
            textTransform: "none",
          }}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send"}
        </Button>
        <Button
          sx={{
            backgroundColor: "#bfbebe",
            color: "white",
            margin: "15px 0px",
            textTransform: "none",
          }}
          onClick={clearChat}
          disabled={isLoading}
        >
          Clear Chat
        </Button>
      </Card>
    </Box>
  );
};

export default ChatBox;
