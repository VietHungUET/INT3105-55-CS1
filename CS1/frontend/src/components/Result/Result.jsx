import { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import './Result.css';

const Result = ({ shortUrl }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false); // Reset copied state when shortUrl changes
  }, [shortUrl]);

  return (
    <>
      {shortUrl && (
        <div className="result">
          <p>{shortUrl}</p>
          <CopyToClipboard
            text={shortUrl}
            onCopy={() => setCopied(true)}
          >
            <button className={copied ? "copied" : ""}>
              {copied ? "COPIED!" : "Copy to Clipboard"}
            </button>
          </CopyToClipboard>
        </div>
      )}
    </>
  );
};

export default Result;
