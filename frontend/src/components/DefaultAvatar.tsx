import React from "react";

interface DefaultAvatarProps {
  initials?: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  initials = "?",
  size = 64,
  bgColor = "#3B82F6", // blue-500
  textColor = "#FFFFFF",
}) => {
  // Generate initials if not provided
  const displayInitials = initials || "?";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${size / 2.5}px`,
        fontWeight: "bold",
      }}
    >
      {displayInitials.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default DefaultAvatar;
