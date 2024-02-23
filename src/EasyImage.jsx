import{useEffect,useState,createElement}from"react";
import EasyCrop from"./components/EasyCrop";
import"./ui/EasyImage.css";
function App(props){
	window.props=props;
	const[image,setImage]=useState("");
	const[id,setId]=useState("");
	const[imageUrl,setImageUrl]=useState("");
	const[translations,setTranslations]=useState({});
	useEffect(()=>{
		if(props?.image?.status=="available"&&props?.image?.value){
			setImageUrl(props.image.value.uri);
		}
		if(props?.guid?.status=="available"&&props?.guid?.value) {
			setId(props.guid.value);
		}
		if(
			props?.translation_crop?.status=="available"&&
			props?.translation_pan?.status=="available"&&
			props?.translation_zoomin?.status=="available"&&
			props?.translation_zoomout?.status=="available"&&
			props?.translation_download?.status=="available"&&
			props?.translation_upload?.status=="available"&&
			props?.translation_rotateclockwise?.status=="available"&&
			props?.translation_rotateanticlockwise?.status=="available"&&
			props?.translation_save?.status=="available"
		){
			setTranslations({
				crop:props.translation_crop.value,
				pan:props.translation_pan.value,
				zoomin:props.translation_zoomin.value,
				zoomout:props.translation_zoomout.value,
				download:props.translation_download.value,
				upload:props.translation_upload.value,
				rotateclockwise:props.translation_rotateclockwise.value,
				rotateanticlockwise:props.translation_rotateanticlockwise.value,
				save:props.translation_save.value
			});
		}else{
			setTranslations({
				crop:"Crop",
				pan:"Pan",
				zoomin:"Zoom In",
				zoomout:"Zoom Out",
				download:"Download",
				upload:"Upload",
				rotateclockwise:"Rotate Clockwise",
				rotateanticlockwise:"Rotate Anticlockwise",
				save:"Save"
			});
		}
	},[props.guid.status,props.image.status]);
	return(
		<div className="App">
			<header className="App-header">
				<EasyCrop onSave={props.onSave} image={imageUrl} id={id} translations={translations}/>
			</header>
		</div>
	);
}
export default App;
