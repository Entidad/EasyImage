import './ImageCrop.css';
import { useState,useRef ,useEffect,createElement,useCallback} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from './Crop';
import { saveCanvas } from './Crop';
import '../ui/EasyImage.css';

export default function EasyCrop({ image, onSave, id }) {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [completedCrop, setCompletedCrop] = useState();
  const imageUrl=image;
  const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
  

console.log ("Image,", image)

  const onZoom = (e) => {
    setScale(parseFloat(e));
  };

  const zoomIn = (e) => {
    setScale((scale) => Math.min(scale + 0.1, 3));
  };

  const zoomOut = () => {
    setScale((scale) => Math.max(scale - 0.1, 0.1)); // Adjust the minimum zoom level as needed
  };

  const rotateRight = () => {
    let newRotation = rotation + 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    setRotation(newRotation);
  };
  const rotateAntiRight = () => {
    let newRotation = rotation - 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    setRotation(newRotation);
  };
  

  const download = async () => {    
    const test = await canvasPreview(imgRef.current, completedCrop, scale, rotation);
   
  };
  
    const handleDownload = async () => {
    
      await canvasPreview(imgRef.current, completedCrop, scale, rotation);
     
    };
  
  const onImageLoad = (e) => {
    setLoading(false);
      setImageLoaded(true);
    setHeight(e?.currentTarget?.height);
    setWidth(e?.currentTarget?.width);
    setCompletedCrop({        
      x: 0,
      y: 0,
      height: e?.currentTarget?.height,
      width: e?.currentTarget?.width,
      unit: 'px'
    }
    );
  };

 const onSaveImage = useCallback(async () => {
 try{
     const time = new Date().toLocaleTimeString();
     const croppedImage = await saveCanvas(imgRef.current, completedCrop, scale, rotation);    
     const blob = toBLob(croppedImage);    
                await mx.data.saveDocument(
                    id,
                    "Image"+id+"_"+time+".jpg",
                    {},
                    blob,
                    function () {
                        console.warn("Image successfully saved");
                        onSave.execute();
                    },
                    function (e) {
                        console.error(e, "Error while saving image");
                    }
                );
              
            } catch (e) {
                console.error(e);
            }
  }, [completedCrop, rotation, scale,imgRef.current]);

    const toBLob = base64Image => {
        // Remove the data:image/jpeg;base64, part from the base64 string
       
        const base64Data = base64Image.split(",")[1];
        console.log ("base64Data", base64Data)
        // Convert the base64 data to a binary array
        const binaryData = atob(base64Data);

        // Create a Uint8Array from the binary data
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            arrayBuffer[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob object from the Uint8Array
        const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
        console.log ("The blob", blob)
        return blob;
    };



  return (

  <div>

        <div className="toolbox-container">
                    <div
                        className="toolbox"
                          style={{
                              display: "flex",
                          flexDirection: "row",
                              flexWrap: "nowrap"
                      }}>
                        <table style={{ width: "100%" }}>
                            <tr>
                            <td style={{ width: "15%" }}>
                            <button className="toolbox-button" onClick={zoomIn}  style={{ width: "100%" }}>
                                Zoom In
                            </button>
                            </td>
                            <td style={{ width: "15%" }}>
                            <button className="toolbox-button" onClick={zoomOut}  style={{ width: "100%" }}>
                                Zoom Out
                            </button>
                            </td> 
                            <td style={{ width: "20%" }}>
                                <button onClick={handleDownload}  style={{ width: "100%" }}> Download </button>
                                </td>
                                <td style={{ width: "20%" }}>
                                <button onClick={rotateRight} style={{ width: "100%" }}>  Rotate </button>
                                </td>
                                <td style={{ width: "20%" }}>
                                <button onClick={rotateAntiRight} style={{ width: "100%" }}>  Rotate  Anticlockwise</button>
                                </td>
                                <td style={{ width: "20%" }}>
                                <button onClick={onSaveImage} style={{ width: "100%" }}>  Save </button>
                                </td>
                            </tr>
                        </table>
                     </div>
                    <div                  
                    onWheel={(e) => {
                    if (e.deltaY > 0) {
                        setScale(scale + 0.1);
                    } else if (e.deltaY < 0 && scale > 0.1) {
                        setScale(scale - 0.1);
                    }
                    }}
                    className="container" 
                >
                  <div className="crop-container">     
                   {loading && !imageLoaded && <progress value="50" max="100"></progress>}               
                        <ReactCrop
                        src={ imageUrl}
                        crop={crop}
                        onChange={(_, percentCrop) => {
                            setCrop(percentCrop);
                        }}
                        onComplete={(e) => {  
                            if (e?.height == 0 || e?.width == 0) {
                              setCompletedCrop({
                                  x: 0,
                                  y: 0,
                                  height: height,
                                  width: width,
                                  unit: 'px'
                              });                              
                            } else {
                            setCompletedCrop(e);                          
                            }
                          // SaveImage(e)
                          }}
                          scale={scale}
                        >                        
                        <img
                            ref={imgRef}
                            crossorigin='anonymous'
                            alt='Error'
                            src={ imageUrl}
                            style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
                            onLoad={onImageLoad}
                        />                        
                    </ReactCrop>
                    </div>                    
                  </div>
      </div>
  </div>
  
  );
}