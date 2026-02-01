import { useEffect, useRef } from "react";
import Popover from "bootstrap/js/dist/popover";

function HelpIcon({ helpLabel }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const pop = new Popover(ref.current, {
      content: helpLabel,
      trigger: "focus",
      placement: "right",
      container: "body",
    });
    return () => pop.dispose();
  }, [helpLabel]);

  return (
    <button
      ref={ref}
      type="button"
      className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-inline-flex justify-content-center align-items-center"
      style={{ width: "1.5rem", height: "1.5rem" }}
      aria-label="Help"
    >
      <span aria-hidden="true">i</span>
    </button>
  );
}

export default HelpIcon