
const Interests = ({edit, tags}) => {
  return (
  <div>
      <div className="tagList">
        { tags &&
          tags.map((tag, idx) =>
              <div className="tag" key={idx}>
                <p>{tag}</p>
              </div>
          )
        }
      </div>
      {edit && <input type="text"/>}
  </div>
  )
}

export default Interests;

