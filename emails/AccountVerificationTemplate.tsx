import { brandName } from '@/constants/main.constants';

interface AccountVerificationProps {
  code: string;
  username?: string;
}

export const AccountVerificationTemplate = ({
  code,
  username = "User",
}: AccountVerificationProps) => {
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
        Thank you for creating an account with us. Please use the verification code below to activate your account.
      </p>
      <p
        style={{
          display: "inline-block",
          padding: "12px 24px",
          margin: "20px 0",
          backgroundColor: "green",
          color: "#fff",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "20px",
          letterSpacing: "4px",
        }}
      >
        {code}
      </p>
      <p style={{ color: "#888", fontSize: "14px" }}>
        This code will expire in 10 minutes.
      </p>
      <p style={{ color: "#888", fontSize: "14px" }}>
        If you did not create this account, please ignore this email.
      </p>
      <p style={{ color: "#888", fontSize: "14px" }}>{brandName} - The Team</p>
    </div>
  );
};

 AccountVerificationTemplate;
