import EditableTextField from "./EditableTextField";
import { getParagraphs, updateParagraph } from "../services/informationalContentService"
import { useState, useEffect } from "react";
import PageType from "../mocks/pageTypeEnum";

export default function ParagraphEditor() {
     // This useState and useEffect code block was generated using ChatGPT assistance.
      const [landingParagraphs, setLandingParagraphs] = useState([]);
      const [wantToHelpParagraphs, setWantToHelpParagraphs] = useState([]);
  
      useEffect(() => {
          let ignore = false;
  
          async function load() {
              // API calls: Informational content fetch
              const landingItems = await getParagraphs(PageType.Landing);
              const wantToHelpItems = await getParagraphs(PageType.WantToHelp);

              if (!ignore) {
                setLandingParagraphs(landingItems);
                setWantToHelpParagraphs(wantToHelpItems);
              }
          }
  
          try {
            load();
          }
          catch {
            setLandingParagraphs([]);
            setWantToHelpParagraphs([]);
          }

          return () => {
              ignore = true;
          };
      }, []);

      // Used ChatGPT help for onSave section and map usage
      return (
        <div className="main">
            <style>{styles}</style>
             <h3>Edit Paragraphs</h3>
            <div className="timeline">
                <div className="timeline-item">
                <h4 className="pageType">Landing Page</h4>
                {landingParagraphs.length === 0 ? "No paragraphs to display." : landingParagraphs.map(paragraph => (
                    <EditableTextField 
                        key={paragraph.id}
                        label={paragraph.id} 
                        value={paragraph.content}
                        onSave={async (newContent) => {
                            await updateParagraph(paragraph.id, PageType.Landing, newContent);
                        }
                    }/>
                )
                )}
                </div>
            
            <div className="timeline-item">
                <h4 className="pageType">Want to Help</h4>
                {wantToHelpParagraphs.length === 0 ? "No paragraphs to display." : wantToHelpParagraphs.map(paragraph => (
                    <EditableTextField 
                        key={paragraph.id}
                        label={paragraph.id} 
                        value={paragraph.content}
                        onSave={async (newContent) => {
                            await updateParagraph(paragraph.id, PageType.WantToHelp, newContent);
                        }
                    }/>
                )
                )}
                </div>
            </div>
         </div>
    )  
}

const styles = `
.timeline {
  position: relative;
  display: grid;
  gap: 1.5rem;
  padding-left: 1.75rem;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.375rem;
  width: 2px;
  border-radius: 2px;
  background: #c7d2fe;
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
}

.pageType {
    color: #4f46e5;
}
.timeline-item::before {
  content: "";
  position: absolute;
  top: 0.75rem;
  left: -1.375rem;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: #4f46e5;
  box-shadow: 0 0 0 3px #eef2ff;
  transform: translate(-50%, -50%);
}

.timeline-item > :first-child {
  margin-top: 0;
}

.timeline-item > :last-child {
  margin-bottom: 0;
}`
