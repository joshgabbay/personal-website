import type { Metadata } from "next";
import { BOOKING_URL } from "./booking";

export const metadata: Metadata = {
  title: "Meet with Josh",
  description: "Pick a time to meet with Josh Gabbay.",
};

// Just the calendar: Google's appointment page, full window.
export default function Meet() {
  return (
    <>
      <iframe
        src={`${BOOKING_URL}?gv=true`}
        title="Meet with Josh"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "#fff",
        }}
      />
      <noscript>
        <a href={BOOKING_URL}>Book a time with Josh</a>
      </noscript>
    </>
  );
}
