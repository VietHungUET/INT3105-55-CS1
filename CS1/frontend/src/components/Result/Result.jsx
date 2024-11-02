import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard"; 
import './Result.css';
const Result = () => {
    const [shortenLink, setShortenLink] = useState("This is result");
    const [copied, setCopied] = useState(false);

    return (
        <>
          {shortenLink && (
        <div className="result">
            <p>{shortenLink}</p>
            <CopyToClipboard
            text={shortenLink}
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
