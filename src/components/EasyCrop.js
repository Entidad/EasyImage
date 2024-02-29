import"./ImageCrop.css";
import{useState,useRef,useEffect,createElement,useCallback}from"react";
import ReactCrop from"react-image-crop";
import"react-image-crop/dist/ReactCrop.css";
import{canvasPreview}from"./Crop";
import{saveCanvas}from"./Crop";
import"../ui/EasyImage.css";
import{TransformWrapper,TransformComponent}from"react-zoom-pan-pinch";
export default function EasyCrop(props){
	const imgRef=useRef(null);
	window.imgRef=imgRef;
	const panZoomRef=useRef(null);
	window.panZoomRef=panZoomRef;
	const reactCropRef=useRef(null);
	const inputRef=useRef(null);
	window.inputRef=inputRef;
	const transformComponentRef=useRef(null);
	window.transformComponentRef=transformComponentRef;
	const[crop,setCrop]=useState(null);
	const[rotation,setRotation]=useState(0);
	const[scale,setScale]=useState(1);
	const[height,setHeight]=useState("");
	const[width,setWidth]=useState("");
	const[completedCrop,setCompletedCrop]=useState();
	const[cropDisabled,setCropDisabled]=useState(false);
	const[file,setFile]=useState();
	const[imageUrl,setImageUrl]=useState(props.image);
	//const imageUrl=props.image;
	const[loading,setLoading]=useState(true);
	const[imageLoaded,setImageLoaded]=useState(false);
	useEffect(()=>{
		setImageUrl(props.image);
	},[props.image]);
	const toggleCropPan=()=>{
		setCropDisabled(!cropDisabled);
	};
	const zoomIn=(e)=>{
		panZoomRef.current.zoomIn();
	};
	const zoomOut=()=>{
		panZoomRef.current.zoomOut();
	};
	const rotateRight=()=>{
		let newRotation=rotation+90;
		if(newRotation>=360){
			newRotation=-360;
		}
		setRotation(newRotation);
	};
	const rotateAntiRight=()=>{
		let newRotation=rotation-90;
		if(newRotation>=360){
			newRotation=-360;
		}
		setRotation(newRotation);
	};
	const download=async()=>{		
		const test=await canvasPreview(imgRef.current,completedCrop,scale,rotation);
	};
	const handleDownload=async()=>{
		await canvasPreview(imgRef.current,completedCrop,scale,rotation);
	};
	const handleUpload=async(e,b,c)=>{
		const reader = new FileReader();
		const file = e.target.files[0];
		if (reader !== undefined && file !== undefined) {
			reader.onloadend = () => {
				imgRef.current.setAttribute("src",reader.result)
			}
			reader.readAsDataURL(file);
		}
	};
	const onImageLoad=(e)=>{
		setLoading(false);
		setImageLoaded(true);
		setHeight(e?.currentTarget?.height);
		setWidth(e?.currentTarget?.width);
		setCompletedCrop({				
			x:0,
			y:0,
			height:e?.currentTarget?.height,
			width:e?.currentTarget?.width,
			unit:'px'
		});
	};
	const onSaveImage=useCallback(async()=>{
		try{
			const time=new Date().toLocaleTimeString();
			const croppedImage=await saveCanvas(imgRef.current,completedCrop,scale,rotation);
			const blob=toBLob(croppedImage);
			mx.data.get({
				guid:props.id,
				callback:async function(obj){
					mx.data.commit({
						mxobj:obj,
						callback:async function(){
							await mx.data.saveDocument(
								props.id,
								"Image"+props.id+"_"+time+".jpg",
								{},
								blob,
								async function(){
									if(
										props.onSave
									){
										if(
											props.onSave.canExecute&&
											props.onSave.isAuthorized&&
											!(
												props.onSave.isExecuting&&
												props.onSave.disabledDuringExecution
											)
										){
											imgRef.current.setAttribute("src",croppedImage);
											await props.onSave.execute();
										}
									}
								},
								function(e){
									console.error(e,"Error while saving image");
								}
							);
						},
						error: function(e) {
							console.error("Could not commit object:", e);
						}
					});
				}
			});
		}catch(e){
			console.error(e);
		}
	},[completedCrop,rotation,scale,imgRef.current]);
	const toBLob=base64Image=>{
		//Remove the data:image/jpeg;base64, part from the base64 string
		const base64Data=base64Image.split(",")[1];
		//Convert the base64 data to a binary array
		const binaryData=atob(base64Data);
		//Create a Uint8Array from the binary data
		const arrayBuffer=new Uint8Array(binaryData.length);
		for(let i=0;i<binaryData.length;i++) {
			arrayBuffer[i]=binaryData.charCodeAt(i);
		}
		//Create a Blob object from the Uint8Array
		const blob=new Blob([arrayBuffer],{type:"image/jpeg"});
		return blob;
	};
	return(
		<div>
			<div className="toolbox-container">
				<div className="toolbox" style={{display:"flex"}}>
					<div className="btn-group">
						{props.toolbar.crop?<button type="button" className={!cropDisabled?"btn btn-success":"btn btn-default"} onClick={toggleCropPan} title={props.renderIcons?props.translations.crop:""}>{props.renderIcons?<span className={props.icons.crop!=null?props.icons.crop:"glyphicon glyphicon-scissors"} aria-hidden="true"></span>:props.translations.crop}</button>:null}
						{props.toolbar.pan?<button type="button" className={cropDisabled?"btn btn-success":"btn btn-default"} onClick={toggleCropPan} title={props.renderIcons?props.translations.pan:""}>{props.renderIcons?<span className={props.icons.pan!=null?props.icons.pan:"glyphicon glyphicon-move"} aria-hidden="true"></span>:props.translations.pan}</button>:null}
						{props.toolbar.zoomin?<button className="btn btn-default" onClick={zoomIn} title={props.renderIcons?props.translations.zoomin:""}>{props.renderIcons?<span className={props.icons.zoomin!=null?props.icons.zoomin:"glyphicon glyphicon-zoom-in"} aria-hidden="true"></span>:props.translations.zoomin}</button>:null}
						{props.toolbar.zoomout?<button className="btn btn-default" onClick={zoomOut} title={props.renderIcons?props.translations.zoomout:""}>{props.renderIcons?<span className={props.icons.zoomout!=null?props.icons.zoomout:"glyphicon glyphicon-zoom-out"} aria-hidden="true"></span>:props.translations.zoomout}</button>:null}
						{props.toolbar.download?<button className="btn btn-default" onClick={handleDownload} title={props.renderIcons?props.translations.download:""}>{props.renderIcons?<span className={props.icons.download!=null?props.icons.download:"glyphicon glyphicon-save"} aria-hidden="true"></span>:props.translations.download}</button>:null}
						{props.toolbar.upload?<button className="btn btn-default" onClick={()=>{
							inputRef.current.click();
						}} title={props.renderIcons?props.translations.upload:""}>{props.renderIcons?<span className={props.icons.upload!=null?props.icons.upload:"glyphicon glyphicon-open"} aria-hidden="true"></span>:props.translations.upload}</button>:null}
						{props.toolbar.upload?<input ref={inputRef} style={{display:"none"}}type="file" accept=".jpeg, .png, .jpg" onChange={handleUpload} />:null}
						{props.toolbar.rotateclockwise?<button className="btn btn-default" onClick={rotateRight} title={props.renderIcons?props.translations.rotateclockwise:""}>{props.renderIcons?<span className={props.icons.rotateclockwise!=null?props.icons.rotateclockwise:"glyphicon glyphicon-refresh"} aria-hidden="true"></span>:props.translations.rotateclockwise}</button>:null}
						{props.toolbar.rotateanticlockwise?<button className="btn btn-default" onClick={rotateAntiRight} title={props.renderIcons?props.translations.rotateanticlockwise:""}>{props.renderIcons?<span className={props.icons.rotateanticlockwise!=null?props.icons.rotateanticlockwise:"glyphicon glyphicon-refresh icon-flipped"} aria-hidden="true"></span>:props.translations.rotateanticlockwise}</button>:null}
						{props.toolbar.save?<button className="btn btn-default" onClick={onSaveImage} title={props.renderIcons?props.translations.save:""}>{props.renderIcons?<span className={props.icons.save!=null?props.icons.save:"glyphicon glyphicon-floppy-save"} aria-hidden="true"></span>:props.translations.save}</button>:null}
					</div>
				</div>
				<div className="container" >
					<div className="crop-container">
						{/*loading&&!imageLoaded&&<progress value="50" max="100"></progress>*/}
						<TransformWrapper
							ref={panZoomRef}
							initialScale={1}
							wheel={{
								step:8
							}}
							initialPositionX={0}
							initialPositionY={0}
							limitToBounds={false}
							minScale={0.1}
							panning={{
								wheelPanning:true,
								panning:true
							}}
							onPanningStart={(e)=>{
							}}
							onPanning={(e)=>{
							}}
							onDrag={(e)=>{
							}}
							onDragStart={(e)=>{
							}}
						>
							<TransformComponent
								ref={transformComponentRef}
							>
								<ReactCrop
									ref={reactCropRef}
									src={imageUrl}
									crop={crop}
									onChange={(_,percentCrop)=>{
										setCrop(percentCrop);
									}}
									onComplete={(e)=>{	
										if(e?.height==0||e?.width==0){
											setCompletedCrop({
												x:0,
												y:0,
												height:height,
												width:width,
												unit:'px'
											});
										}else{
											setCompletedCrop(e);													
										}
									}}
									scale={scale}
									disabled={cropDisabled}
									onDragStart={(e)=>{}}
									onDragEnd={(e)=>{}}
								>
									<img
										ref={imgRef}
										crossorigin='anonymous'
										src={imageUrl}
										style={{
											'transform':`rotate(${rotation}deg)`
										}}
										onLoad={onImageLoad}
									/>
								</ReactCrop>
							</TransformComponent>
						</TransformWrapper>
					</div>
				</div>
			</div>
		</div>
	);
}
