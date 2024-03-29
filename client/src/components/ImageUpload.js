import ImagePreview from "./ImagePreview";

const ImageUpload = ({ name, imageBuffer, onFileChange, title }) => {
  const handleFileChange = (e) => {
    onFileChange(e); // Pass the event up to the parent component
  };

  return (
    <div>
      <label htmlFor={name}>{title}</label>
      <input
        type="file"
        name={name}
        id={name}
        onChange={handleFileChange}
        accept="image/*"
        multiple
      />
      <ImagePreview image={imageBuffer} />
    </div>
  );
};

export default ImageUpload;
