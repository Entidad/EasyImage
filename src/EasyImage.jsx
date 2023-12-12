import { useEffect, useState, createElement } from "react";
import EasyCrop from "./components/EasyCrop";
import "./ui/EasyImage.css";


function App(props) {
    const [image, setImage] = useState("");
    const [id, setId] = useState("");
  
    console.warn("Props ", props);
   
    useEffect(() => {
        if (props?.data?.status == "available") {
          
            const associationValue = props.someAttr.get(props.data.items[0]).displayValue;
            console.log ("Test",associationValue)
            if (associationValue != "")
            {
                setImage(associationValue);

                const splitID = associationValue.split("&")[1].toString(); 
                const ImageID = splitID.split("=")[1].toString(); 
                
                setId(ImageID);
            }
        }
    }, [props.data.status]);
   
    const handleImageUpload = async (e) => {  
        setImage(URL.createObjectURL(e.target.files[0]));
      };

    return (
        <div className="App">
            <header className="App-header">
                {/* <EasyCrop onSave={props.onSave} image={`data:image/jpeg;base64,${image}`} id={id} /> */}
                <EasyCrop onSave={props.onSave} image={image} id={id} />
            </header>
        </div>
    );
}

export default App;
