import"./ImageCrop.css";
import{useState,useRef,useEffect,createElement,useCallback}from"react";
import ReactCrop from"react-image-crop";
import"react-image-crop/dist/ReactCrop.css";
import{canvasPreview}from"./Crop";
import{saveCanvas}from"./Crop";
import"../ui/EasyImage.css";
import{TransformWrapper,TransformComponent}from"react-zoom-pan-pinch";
export default function EasyCrop({image,onSave,id}){
	const imgRef=useRef(null);
	const panZoomRef=useRef(null);
	const reactCropRef=useRef(null);
	const inputRef=useRef(null);
	const[crop,setCrop]=useState(null);
	const[rotation,setRotation]=useState(0);
	const[scale,setScale]=useState(1);
	const[height,setHeight]=useState("");
	const[width,setWidth]=useState("");
	const[completedCrop,setCompletedCrop]=useState();
	const[cropDisabled,setCropDisabled]=useState(false);
	const[file,setFile]=useState();
	const imageUrl=image;
	const[loading,setLoading]=useState(true);
	const[imageLoaded,setImageLoaded]=useState(false);
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
				guid:id,
				callback:async function(obj){
					mx.data.commit({
						mxobj:obj,
						callback:async function(){
							await mx.data.saveDocument(
								id,
								"Image"+id+"_"+time+".jpg",
								{},
								blob,
								async function(){
									if(
										onSave
									){
										if(
											onSave.canExecute&&
											onSave.isAuthorized&&
											!(
												onSave.isExecuting&&
												onSave.disabledDuringExecution
											)
										){
											await onSave.execute();
											imgRef.current.setAttribute("src",croppedImage);
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
				<div className="toolbox" style={{display:"flex",flexDirection:"row",flexWrap:"nowrap"}}>
					<table style={{width:"100%"}}>
						<tr>
							<td style={{width:"7.5%"}}>
								<button type="button" className={!cropDisabled?"toolbox-button-active":"toolbox-button"} onClick={toggleCropPan}>Crop</button>
							</td>
							<td style={{width:"7.5%"}}>
								<button type="button" className={cropDisabled?"toolbox-button-active":"toolbox-button"} onClick={toggleCropPan}>Pan</button>
							</td>
							<td style={{width:"15%"}}>
								<button className="toolbox-button" onClick={zoomIn} style={{ width: "100%" }}>Zoom In</button>
							</td>
							<td style={{width:"15%" }}>
								<button className="toolbox-button" onClick={zoomOut} style={{ width: "100%" }}>Zoom Out</button>
							</td> 
							<td style={{width:"20%"}}>
								<button onClick={handleDownload} style={{width:"100%" }}>Download</button>
							</td>
							<td style={{width:"20%"}}>
								<button onClick={()=>{
									inputRef.current.click();
								}} style={{width:"100%" }}>Upload</button>
								<input style="display:none;" ref={inputRef} type="file" accept=".jpef, .png, .jpg" onChange={handleUpload} />
							</td>

							<td style={{width:"20%"}}>
								<button onClick={rotateRight} style={{width:"100%"}}>Rotate</button>
							</td>
							<td style={{width:"20%"}}>
								<button onClick={rotateAntiRight} style={{width:"100%"}}>Rotate	Anticlockwise</button>
							</td>
							<td style={{width:"20%"}}>
								<button onClick={onSaveImage} style={{width:"100%"}}>Save</button>
							</td>
						</tr>
					</table>
				</div>
				<div className="container" >
					<div className="crop-container">
						{loading&&!imageLoaded&&<progress value="50" max="100"></progress>}
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
							<TransformComponent>
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
											'transform':`rotate(${rotation}deg)`,
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
