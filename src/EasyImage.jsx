import{useEffect,useState,createElement}from"react";
import EasyCrop from"./components/EasyCrop";
import"./ui/EasyImage.css";
function App(props){
	window.props=props;
	const[image,setImage]=useState("");
	const[imageId,setImageId]=useState(null);
	const[imageUrl,setImageUrl]=useState(null);
	const[translations,setTranslations]=useState({});
	const[icons,setIcons]=useState({});
	const[toolbar,setToolbar]=useState({});
	useEffect(()=>{
		if(props?.guid?.status=="available"&&props?.guid?.value!=null&&props?.guid?.value!=""){
			setImageId(props.guid.value);
		}
		if(props?.url?.status=="available"&&props.url.value!=null&&props.url.value!=""){
			setImageUrl(props.url.value);
		}else if(props?.image?.status=="available"&&props?.image?.value?.uri!=null&&props?.image?.value?.uri!=""){
			setImageUrl(props.image.value.uri);
		}
		//translations
		{
			setTranslations({
				crop:props?.translation_crop?.status=="available"?props.translation_crop.value:"Crop",
				pan:props?.translation_pan?.status=="available"?props.translation_pan.value:"Pan",
				zoomin:props?.translation_zoomin?.status=="available"?props.translation_zoomin.value:"Zoom In",
				zoomout:props?.translation_zoomout?.status=="available"?props.translation_zoomout.value:"Zoom Out",
				download:props?.translation_download?.status=="available"?props.translation_download.value:"Download",
				upload:props?.translation_upload?.status=="available"?props.translation_upload.value:"Upload",
				rotateclockwise:props?.translation_rotateclockwise?.status=="available"?props.translation_rotateclockwise.value:"Rotate Clockwise",
				rotateanticlockwise:props?.translation_rotateanticlockwise?.status=="available"?props.translation_rotateanticlockwise.value:"Rotate Anticlockwise",
				save:props?.translation_save?.status=="available"?props.translation_save.value:"Save"
			});
		}
		//icons
		{
			setIcons({
				crop:props?.icon_crop?.status=="available"?"glyphicon "+props.icon_crop.value.iconClass:null,
				pan:props?.icon_pan?.status=="available"?"glyphicon "+props.icon_pan.value.iconClass:null,
				zoomin:props?.icon_zoomin?.status=="available"?"glyphicon "+props.icon_zoomin.value.iconClass:null,
				zoomout:props?.icon_zoomout?.status=="available"?"glyphicon "+props.icon_zoomout.value.iconClass:null,
				download:props?.icon_download?.status=="available"?"glyphicon "+props.icon_download.value.iconClass:null,
				upload:props?.icon_upload?.status=="available"?"glyphicon "+props.icon_upload.value.iconClass:null,
				rotateclockwise:props?.icon_rotateclockwise?.status=="available"?"glyphicon "+props.icon_rotateclockwise.value.iconClass:null,
				rotateanticlockwise:props?.icon_rotateanticlockwise?.status=="available"?"glyphicon "+props.icon_rotateanticlockwise.value.iconClass:null,
				save:props?.icon_save?.status=="available"?"glyphicon "+props.icon_save.value.iconClass:null
			});
		}
		{
			setToolbar({
				crop:props.render_icon_crop,
				pan:props.render_icon_pan,
				zoomin:props.render_icon_zoomin,
				zoomout:props.render_icon_zoomout,
				download:props.render_icon_download,
				upload:props.render_icon_upload,
				rotateclockwise:props.render_icon_rotateclockwise,
				rotateanticlockwise:props.render_icon_rotateanticlockwise,
				save:props.render_icon_save
			});
		}
	},[props?.guid?.value,props?.url?.value,props?.image?.value?.uri]);
	useEffect(()=>()=>{
		//unmount
	},[]);
	return(
		<div className="io_entidad_widget_easyimage_EasyImage">
			<header className="io_entidad_widget_easyimage_EasyImage-header">
				<EasyCrop onSave={props.onSave} imageUrl={imageUrl} imageId={imageId} translations={translations} renderIcons={props.renderIcons} icons={icons} toolbar={toolbar}/>
			</header>
		</div>
	);
}
export default App;
