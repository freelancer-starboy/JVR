"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
    
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={styles.message}>
          Thank you for your payment. Your transaction was successful.
        </p>
        <div style={styles.transactionId}>
          <strong>Transaction ID:</strong> {transactionId || "N/A"}
        </div>
        <button style={styles.button} onClick={() => window.location.href = "/"}>
          Go Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f6f9fc",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "24px",
    color: "#28a745",
    marginBottom: "20px",
  },
  message: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  transactionId: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "30px",
    wordWrap: "break-word",
  },
  button: {
    backgroundColor: "#3399cc",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#2879a3",
  },
};
