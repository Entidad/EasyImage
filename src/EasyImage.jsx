import{useEffect,useState,createElement}from"react";
import EasyCrop from"./components/EasyCrop";
import"./ui/EasyImage.css";
function App(props){
	const[imageId,setImageId]=useState(null);
	const[imageUrl,setImageUrl]=useState(null);
	const[disabled,setDisabled]=useState(true);
	const[translations,setTranslations]=useState({});
	const[icons,setIcons]=useState({});
	const[toolbar,setToolbar]=useState({});
	useEffect(()=>{
		console.info("main:useEffect:[props?.guid?.value,props?.url?.value,props?.image?.value?.uri]:beg");
		if(props?.guid?.status=="available"&&props?.guid?.value!=null&&props?.guid?.value!=""){
			setImageId(props.guid.value);
		}
		if(props?.url?.status=="available"&&props.url.value!=null&&props.url.value!=""){
			setImageUrl(props.url.value);
			setDisabled(false);
		}else if(props?.image?.status=="available"&&props?.image?.value?.uri!=null&&props?.image?.value?.uri!=""){
			setImageUrl(props.image.value.uri);
			setDisabled(false);
		}else{
			setDisabled(true);
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
				rotatecounterclockwise:props?.translation_rotatecounterclockwise?.status=="available"?props.translation_rotatecounterclockwise.value:"Rotate Counterclockwise",
				save:props?.translation_save?.status=="available"?props.translation_save.value:"Save"
			});
		}
		//icons
		{
			//props.icon_pan.value.type
			//	glyph
			//props.icon_crop.value.type
			//	image
			setIcons({
				crop:props?.icon_crop?.status=="available"?{"type":props.icon_crop.value.type,"value":(props.icon_crop.value.type=="glyph")?("glyphicon "+props.icon_crop.value.iconClass):(props.icon_crop.value.iconUrl),}:null,
				pan:props?.icon_pan?.status=="available"?{"type":props.icon_pan.value.type,"value":(props.icon_pan.value.type=="glyph")?("glyphicon "+props.icon_pan.value.iconClass):(props.icon_pan.value.iconUrl),}:null,
				zoomin:props?.icon_zoomin?.status=="available"?{"type":props.icon_zoomin.value.type,"value":(props.icon_zoomin.value.type=="glyph")?("glyphicon "+props.icon_zoomin.value.iconClass):(props.icon_zoomin.value.iconUrl),}:null,
				zoomout:props?.icon_zoomout?.status=="available"?{"type":props.icon_zoomout.value.type,"value":(props.icon_zoomout.value.type=="glyph")?("glyphicon "+props.icon_zoomout.value.iconClass):(props.icon_zoomout.value.iconUrl),}:null,
				download:props?.icon_download?.status=="available"?{"type":props.icon_download.value.type,"value":(props.icon_download.value.type=="glyph")?("glyphicon "+props.icon_download.value.iconClass):(props.icon_download.value.iconUrl),}:null,
				upload:props?.icon_upload?.status=="available"?{"type":props.icon_upload.value.type,"value":(props.icon_upload.value.type=="glyph")?("glyphicon "+props.icon_upload.value.iconClass):(props.icon_upload.value.iconUrl),}:null,
				rotateclockwise:props?.icon_rotateclockwise?.status=="available"?{"type":props.icon_rotateclockwise.value.type,"value":(props.icon_rotateclockwise.value.type=="glyph")?("glyphicon "+props.icon_rotateclockwise.value.iconClass):(props.icon_rotateclockwise.value.iconUrl),}:null,
				rotatecounterclockwise:props?.icon_rotatecounterclockwise?.status=="available"?{"type":props.icon_rotatecounterclockwise.value.type,"value":(props.icon_rotatecounterclockwise.value.type=="glyph")?("glyphicon "+props.icon_rotatecounterclockwise.value.iconClass):(props.icon_rotatecounterclockwise.value.iconUrl),}:null,
				save:props?.icon_save?.status=="available"?{"type":props.icon_save.value.type,"value":(props.icon_save.value.type=="glyph")?("glyphicon "+props.icon_save.value.iconClass):(props.icon_save.value.iconUrl),}:null
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
				rotatecounterclockwise:props.render_icon_rotatecounterclockwise,
				save:props.render_icon_save
			});
		}
		console.info("main:useEffect:[props?.guid?.value,props?.url?.value,props?.image?.value?.uri]:end");
	},[props?.guid?.value,props?.url?.value,props?.image?.value?.uri]);
	useEffect(()=>()=>{
		console.info("main:useEffect:[]:beg");
		//unmount
		console.info("main:useEffect:[]:end");
	},[]);
	return(
		<div className="io_entidad_widget_easyimage_EasyImage">
			<div className="io_entidad_widget_easyimage_EasyImage-header">
				<EasyCrop disabled={disabled} onSave={props.onSave} imageUrl={imageUrl} imageId={imageId} translations={translations} renderIcons={props.renderIcons} icons={icons} toolbar={toolbar}/>
			</div>
		</div>
	);
}
export default App;
