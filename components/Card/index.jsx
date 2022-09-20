import { boxShadows } from "../GlobalStyles";

export const Card = ({ children }) => {
  return (
    <div
      style={{
        width: 150,
        height: 150,
        border: "1px solid #ccc",
        boxShadow: boxShadows.default
      }}
    >
      {children}
    </div>
  );
};

export default Card;
