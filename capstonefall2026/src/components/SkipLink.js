function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        left: "16px",
        top: "-100px",
        zIndex: 9999,
        padding: "12px 16px",
        backgroundColor: "#ffffff",
        color: "#000000",
        border: "3px solid #000000",
        borderRadius: "4px",
        fontWeight: "700",
      }}
      onFocus={(event) => {
        event.currentTarget.style.top = "16px";
      }}
      onBlur={(event) => {
        event.currentTarget.style.top = "-100px";
      }}
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;