import { getBadgeProps } from "@/utils/helper";

const IsActiveBadge: React.FC<{ status: string }> = ({ status }) => {
  const { text, color } = getBadgeProps(status);
  return <span className={`badge ${color} status-badge`}  style={{
        borderRadius: 0,
        padding: "5px 10px",      // fixed padding
        minWidth: "80px",          // ensures same width
        display: "inline-block",
        textAlign: "center",
        fontWeight:"bold"
      }}>{text}</span>;

};
export default IsActiveBadge;