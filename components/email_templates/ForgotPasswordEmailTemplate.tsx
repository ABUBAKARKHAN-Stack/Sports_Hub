interface EmailTemplateProps {
  token: string;
  username?: string;
}

export function ForgotPasswordEmailTemplate({
  token,
  username = "User",
}: EmailTemplateProps) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ color: "#333" }}>Hello {username},</h2>
      <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
        We received a request to reset the password for your account.
      </p>
      <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
        Click the button below to reset your password. This link will expire in 1 hour.
      </p>
      <a
        href={resetUrl}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          margin: "20px 0",
          backgroundColor: "#4f46e5",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        Reset Password
      </a>
      <p style={{ color: "#888", fontSize: "14px" }}>
        If you did not request a password reset, please ignore this email.
      </p>
      <p style={{ color: "#888", fontSize: "14px" }}>— The Team</p>
    </div>
  );
}
