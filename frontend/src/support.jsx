import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./navbar";

const models = [
    "llama-3.3-70b-versatile",
    "llama-3.3-70b-specdec",
    "llama-3.2-1b-preview",
    "llama-3.2-3b-preview",
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "llama-guard-3-8b",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
    "whisper-large-v3",
    "whisper-large-v3-turbo",
    "distil-whisper-large-v3-en",
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview"
];

const Support = () => {
    const [question, setQuestion] = useState("");
    const [conversation, setConversation] = useState([]);
    const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
    const currentUser = localStorage.getItem("currentUser");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            toast.error("Please enter your question.", { autoClose: 2000 });
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: currentUser, question, model: selectedModel }),
            });
            if (response.ok) {
                const data = await response.json();
                setConversation([...data.conversation].reverse());
                setQuestion("");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to get support response.", { autoClose: 2000 });
            }
        }
        catch {
            toast.error("An error occurred. Please try again later.", { autoClose: 2000 });
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4 flex-grow-1">
                <h1>Support</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="questionLabel" className="form-label mb-0">Your Question</label>
                            <div style={{ minWidth: "200px" }}>
                                <label htmlFor="model" className="form-label mb-0">Model</label>
                                <select id="model" className="form-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                    {models.map((model, idx) => (<option key={idx} value={model}> {model} </option>))}
                                </select>
                            </div>
                        </div>
                        <textarea
                            id="question"
                            className="form-control mt-2"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            rows="4"
                            placeholder="Enter your support question here..."
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Query</button>
                </form>
                <hr />
                <h2>Conversation History</h2>
                {conversation.length === 0 ? (<p>No previous queries.</p>) : (
                    conversation.map((entry, index) => (
                        <div key={index} className="card my-2">
                            <div className="card-body">
                                <p><strong>Q:</strong> {entry.query}</p>
                                <p><strong>A:</strong> {entry.response}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1 mt-auto"> <p> <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}> Go back to Home </NavLink> </p> </div>
        </div>
    );
};

export default Support;

