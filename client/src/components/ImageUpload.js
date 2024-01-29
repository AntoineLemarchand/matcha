const ImageUpload = ({ name, imageBuffer, onFileChange }) => {
  const handleFileChange = (e) => {
    onFileChange(e); // Pass the event up to the parent component
  };

  const imagePreview = (imageBuffer) => {
    // if image buffer is a relative path render from static backend
    if (imageBuffer.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL}${imageBuffer}`;
    } else {
      return imageBuffer.toString("base64");
    }
  }

  return (
    <div>
      <label htmlFor={name}>Profile picture</label>
      <input
        type="file"
        name={name}
        id={name}
        onChange={handleFileChange}
        accept="image/*"
        multiple
      />
      { imageBuffer &&
        <img
          src={imagePreview(imageBuffer)}
          alt="Preview"
          style={{ height: "200px" }}
        />
      }
    </div>
  );
};

export default ImageUpload;
