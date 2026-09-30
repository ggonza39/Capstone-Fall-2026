function SkipLink() {
    return (
        <a
            href="#main-content"
            style={{
                position: "absolute",
                left: "12px",
                top: "-100px",
                zIndex: 9999,

                padding: "8px 10px",
                backgroundColor: "#ffffff",
                color: "#000000",

                border: "2px solid #000000",
                outline: "none",

                borderRadius: "4px",
                fontSize: "15px",
                lineHeight: "1.2",
                fontWeight: "700",
                whiteSpace: "nowrap",
            }}
            onFocus={(event) => {
                event.currentTarget.style.top = "16px";

                event.currentTarget.style.outline = "none";
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
