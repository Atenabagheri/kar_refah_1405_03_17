import { PiEye, PiPencilSimpleLine, PiX } from "react-icons/pi";
import ImageUploading, { type ImageListType } from "react-images-uploading";

type ImageType = {
  image: ImageListType;
  setImage: React.Dispatch<React.SetStateAction<ImageListType>>;
};
const ImageUpload = ({ image, setImage }: ImageType) => {
  const maxNumber = 1;

  const onChange = (
    image: ImageListType,
    addUpdateIndex?: Array<number>,
  ): void => {
    // data for submit
    console.log(image, typeof addUpdateIndex);
    setImage(image);
  };
  return (
    <ImageUploading
      value={image}
      onChange={onChange}
      dataURLKey="data_url"
      maxNumber={maxNumber}
    >
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        // write your building UI
        <div className="upload__image-wrapper">
          <button
            style={isDragging ? { color: "red" } : undefined}
            className="text-sm bg-dark/10 text-dark !p-2 rounded-md cursor-pointer shadow-md"
            onClick={onImageUpload}
            {...dragProps}
          >
            انتخاب عکس
          </button>
          <div className="flex items-center gap-2 flex-wrap !mt-4">
            {imageList.map((image, index) => (
              <div
                key={index}
                className="image-item rounded-lg overflow-hidden relative shadow-md"
              >
                <img src={image["data_url"]} alt="" width="160" />
                <div className="absolute top-1 left-1 text-white text-lg flex items-center gap-1 bg-black/50 rounded-md">
                  <button
                    onClick={() => console.log({ image, index })}
                    className="cursor-pointer"
                  >
                    <PiEye />
                  </button>
                  <button
                    onClick={() => onImageUpdate(index)}
                    className="cursor-pointer"
                  >
                    <PiPencilSimpleLine />
                  </button>
                  <button
                    onClick={() => onImageRemove(index)}
                    className="cursor-pointer"
                  >
                    <PiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ImageUploading>
  );
};

export default ImageUpload;
