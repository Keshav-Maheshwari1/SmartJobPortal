// Reusable info display
const Info = ({ label, value }) => (
  <p>
    <span className="font-medium text-blue-400">{label}:</span>{" "}
    <span className="text-gray-300">{value || "N/A"}</span>
  </p>
);

export default Info;
