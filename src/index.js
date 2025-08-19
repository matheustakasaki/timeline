import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import Main from "./main.js";
import "./index.css";

function App() {
  return (
    <div>
      <h2>Good luck with your assignment! {"\u2728"}</h2>
      <h3>{timelineItems.length} timeline items to render</h3>
      <Main items={timelineItems} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);