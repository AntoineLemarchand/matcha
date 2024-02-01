import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Interests = ({edit, tags, onChange}) => {

  const [inputContent, setInputContent] = useState('');
  const [currentTags, setCurrentTags] = useState(tags ?? []);

  const updateTags = (event) => {
    event.preventDefault();
    if (event.code === 'Space' || event.code === 'Enter' || event.code === 'Tab' || event.key === '|' || inputContent.length > 10) {
      setCurrentTags([...currentTags, inputContent])
      setInputContent('');
    } else if (event.code === 'Backspace') {
      setInputContent('');
    } else if (event.key.length === 1) {
      setInputContent(inputContent + event.key)
    }
  }

  const removeTag = (idx) => {
    const newTags = [...currentTags];
    newTags.splice(idx, 1);
    console.log(newTags);
    setCurrentTags(newTags);
  }

  return (
  <div>
      {onChange && <input name="tags" type="hidden" onChange={onChange} value={currentTags.join('|')}/>}
      <div className="tagList">
        { currentTags &&
          currentTags.map((tag, idx) =>
              <div className="tag" key={idx}>
                <p>{tag}</p>
                {edit && <button type="button"><FontAwesomeIcon icon={faClose} onClick={()=>removeTag(idx)}/></button>}
              </div>
          )
        }
      </div>
      {edit && <input type="text" onKeyDown={updateTags} value={inputContent}/>}
  </div>
  )
}

export default Interests;
