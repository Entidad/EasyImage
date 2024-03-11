import{useState,useRef,useEffect,createElement,useCallback}from"react";
import ReactCrop from"react-image-crop";
import"react-image-crop/dist/ReactCrop.css";
import"../ui/EasyImage.css";
import{TransformWrapper,TransformComponent}from"react-zoom-pan-pinch";
//https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
const FindReact=(dom,traverseUp=0)=>{
	const key=Object.keys(dom).find(key=>{
		return key.startsWith("__reactFiber$")//react 17+
			||key.startsWith("__reactInternalInstance$");//react <17
	});
	const domFiber=dom[key];
	if(domFiber==null)return null;
	//react <16
	if(domFiber._currentElement){
		let compFiber=domFiber._currentElement._owner;
		for(let i=0;i<traverseUp;i++){
			compFiber=compFiber._currentElement._owner;
		}
		return compFiber._instance;
	}
	//react 16+
	const GetCompFiber=fiber=>{
		//return fiber._debugOwner; // this also works, but is __DEV__ only
		let parentFiber=fiber.return;
		while(typeof parentFiber.type=="string") {
			parentFiber=parentFiber.return;
		}
		return parentFiber;
	};
	let compFiber=GetCompFiber(domFiber);
	for(let i=0;i<traverseUp;i++){
		compFiber=GetCompFiber(compFiber);
	}
	return compFiber.stateNode;
}
export default function EasyCrop(props){
	const canvasRef=useRef(null);
	const transformComponentRef=useRef(null);
	const panZoomRef=useRef(null);
	window.panZoomRef=panZoomRef;
	const inputRef=useRef(null);
	const reactCropRef=useRef(null);
	const[canvasImage,setCanvasImage]=useState(null);
	const[canvasContext,setCanvasContext]=useState(null);
	const[cropDisabled,setCropDisabled]=useState(false);
	const[imageUrl,setImageUrl]=useState(props.imageUrl);
	const[imageId,setImageId]=useState(props.id);
	const[imageDataUrl,setImageDataUrl]=useState(null);
	const[width,setWidth]=useState(null);
	window.width=width;
	const[height,setHeight]=useState(null);
	window.height=height;
	const[angle,setAngle]=useState(0);
	const[crop,setCrop]=useState(null);
	const[completedCrop,setCompletedCrop]=useState();
	const[scale,setScale]=useState(1);
	useEffect(()=>{
		if(props.imageUrl==null||props.imageUrl.length==0)return;
		setImageId(props.imageId);
		setImageUrl(props.imageUrl);
		toDataURL(props.imageUrl,(dataUrl)=>{
			setImageDataUrl(dataUrl);
			let canvas=canvasRef.current;
			let canvas_context=canvas.getContext("2d");
			let canvas_image=new Image();
			canvas_image.onload=()=>{
				setWidth(canvas_image.width);
				setHeight(canvas_image.height);
				canvas.width=canvas_image.width;
				canvas.height=canvas_image.height;
				canvas_context.drawImage(canvas_image,0,0);
				panZoomRef.current.setTransform(
					0,
					0,
					panZoomRef.current.instance.contentComponent.parentElement.parentElement.parentElement.parentElement.offsetWidth/panZoomRef.current.instance.contentComponent.firstChild.firstChild.firstChild.offsetWidth
				)
			};
			canvas_image.src=dataUrl;
			setCanvasContext(canvas_context);
			setCanvasImage(canvas_image);
		});
	},[props.imageUrl,props.imageId]);
	useEffect(()=>{
		if(canvasContext==null)return;
		if(canvasImage==null)return;
		if(Math.abs(angle)%180==90){
			canvasRef.current.width=height;
			canvasRef.current.height=width;
		}else{
			canvasRef.current.width=width;
			canvasRef.current.height=height;
		}
		canvasContext.translate(canvasRef.current.width/2,canvasRef.current.height/2);
		canvasContext.rotate(angle*Math.PI/180);
		canvasContext.translate(-(canvasRef.current.width/2),-(canvasRef.current.height/2));
		canvasContext.drawImage(canvasImage,canvasRef.current.width/2-canvasImage.width/2,canvasRef.current.height/2-canvasImage.height/2,canvasImage.width,canvasImage.height);
		canvasContext.restore();
	},[angle]);
	useEffect(()=>()=>{
		//unmount
	},[]);
	const toDataURL=(url,callback)=>{
		let xhr=new XMLHttpRequest();
		xhr.onload=()=>{
			let reader=new FileReader();
			reader.onloadend=()=>{
				callback(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET',url);
		xhr.responseType='blob';
		xhr.send();
	}
	const togglePan=()=>{
		setCropDisabled(true);
	};
	const toggleCrop=()=>{
		setCropDisabled(false);
	};
	const zoomIn=(e)=>{
		panZoomRef.current.zoomIn(0.25);
	};
	const zoomOut=()=>{
		panZoomRef.current.zoomOut(0.25);
	};
	const rotateRight=()=>{
		setAngle(angle+90);
	};
	const rotateLeft=()=>{
		setAngle(angle-90);
	};
	const download=async()=>{		
	};
	const handleDownload=async()=>{
		const time=new Date().toLocaleTimeString();
		let link=document.createElement('a');
		link.download="Image"+imageId+"_"+time+".jpg";
		link.href=canvasRef.current.toDataURL()
		link.click();
	};
	const handleUpload=async(e,b,c)=>{
		const reader=new FileReader();
		const file=e.target.files[0];
		if(reader!==undefined&&file!==undefined){
			reader.onloadend=()=>{
				let img=new Image();
				img.onload=()=>{
					setCanvasImage(img);
					let canvas_context=canvasRef.current.getContext("2d");
					setCanvasContext(canvas_context);
					canvasRef.current.width=img.width;
					canvasRef.current.height=img.height;
					setWidth(img.width);
					setHeight(img.width);
					canvas_context.drawImage(img,0,0);
					panZoomRef.current.setTransform(
						0,
						0,
						panZoomRef.current.instance.contentComponent.parentElement.parentElement.parentElement.parentElement.offsetWidth/panZoomRef.current.instance.contentComponent.firstChild.firstChild.firstChild.offsetWidth
					)
				};
				img.src=reader.result;
			}
			reader.readAsDataURL(file);
		}
	};
	const onSaveImage=useCallback(async()=>{
		try{
			if(
				completedCrop==null||
				completedCrop.x==0&&
				completedCrop.y==0&&
				completedCrop.width==width&&
				completedCrop.height==height
			){
				return;
			}
			const time=new Date().toLocaleTimeString();
			let newCanvas=null;
			if(completedCrop!=null){
				newCanvas=document.createElement('canvas');
				newCanvas.width=completedCrop.width/panZoomRef.current.instance.transformState.scale;
				newCanvas.height=completedCrop.height/panZoomRef.current.instance.transformState.scale;
				newCanvas.getContext('2d').drawImage(canvasRef.current,
					 -completedCrop.x/panZoomRef.current.instance.transformState.scale
					,-completedCrop.y/panZoomRef.current.instance.transformState.scale
				);
			}else{
				newCanvas=canvasRef.current;
			}
			const blob=await new Promise(resolve => newCanvas.toBlob(resolve));
			mx.data.get({
				guid:imageId,
				callback:(obj)=>{
					mx.data.commit({
						mxobj:obj,
						callback:async()=>{
							await mx.data.saveDocument(
								imageId,
								"Image"+imageId+"_"+time+".jpg",
								{},
								blob,
								async()=>{
									reactCropRef.current.props.onChange()
									setCompletedCrop(null);
									window.setTimeout(()=>{
										//panZoomRef.current.centerView();
										panZoomRef.current.setTransform(
											0,
											0,
											panZoomRef.current.instance.contentComponent.parentElement.parentElement.parentElement.parentElement.offsetWidth/panZoomRef.current.instance.contentComponent.firstChild.firstChild.firstChild.offsetWidth
										)
									},500);
									try{
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
												//attempt to clear out all other file upload boxes
												document.querySelectorAll('.mx-imageuploader input[type=file]').forEach((n)=>{
													let imageUploader=FindReact(n,2);
													imageUploader.props.children.props.upload.setValue(null);
												});
												await props.onSave.execute();
											}
										}
									}catch(e){
										console.error(e.toString());
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
	},[completedCrop,angle,scale,canvasRef.current,imageId]);
	return(
		<div>
			<div className="toolbox-container">
				<div className="toolbox" style={{display:"flex"}}>
					<div className="btn-group">
						{props.toolbar.crop?<button type="button" className={!cropDisabled?"btn btn-sm btn-success":"btn btn-sm btn-default"} onClick={toggleCrop} title={props.renderIcons?props.translations.crop:""}>{props.renderIcons?<span className={props.icons.crop!=null?props.icons.crop:"glyphicon glyphicon-scissors"} aria-hidden="true"></span>:props.translations.crop}</button>:null}
						{props.toolbar.pan?<button type="button" className={cropDisabled?"btn btn-sm btn-success":"btn btn-sm btn-default"} onClick={togglePan} title={props.renderIcons?props.translations.pan:""}>{props.renderIcons?<span className={props.icons.pan!=null?props.icons.pan:"glyphicon glyphicon-move"} aria-hidden="true"></span>:props.translations.pan}</button>:null}
						{props.toolbar.zoomin?<button className="btn btn-sm btn-default" onClick={zoomIn} title={props.renderIcons?props.translations.zoomin:""}>{props.renderIcons?<span className={props.icons.zoomin!=null?props.icons.zoomin:"glyphicon glyphicon-zoom-in"} aria-hidden="true"></span>:props.translations.zoomin}</button>:null}
						{props.toolbar.zoomout?<button className="btn btn-sm btn-default" onClick={zoomOut} title={props.renderIcons?props.translations.zoomout:""}>{props.renderIcons?<span className={props.icons.zoomout!=null?props.icons.zoomout:"glyphicon glyphicon-zoom-out"} aria-hidden="true"></span>:props.translations.zoomout}</button>:null}
						{props.toolbar.download?<button className="btn btn-sm btn-default" onClick={handleDownload} title={props.renderIcons?props.translations.download:""}>{props.renderIcons?<span className={props.icons.download!=null?props.icons.download:"glyphicon glyphicon-save"} aria-hidden="true"></span>:props.translations.download}</button>:null}
						{props.toolbar.upload?<button className="btn btn-sm btn-default" onClick={()=>{
							inputRef.current.click();
						}} title={props.renderIcons?props.translations.upload:""}>{props.renderIcons?<span className={props.icons.upload!=null?props.icons.upload:"glyphicon glyphicon-open"} aria-hidden="true"></span>:props.translations.upload}</button>:null}
						{props.toolbar.upload?<input ref={inputRef} style={{display:"none"}}type="file" accept=".jpeg, .png, .jpg" onChange={handleUpload} />:null}
						{props.toolbar.rotateclockwise?<button className="btn btn-sm btn-default" onClick={rotateRight} title={props.renderIcons?props.translations.rotateclockwise:""}>{props.renderIcons?<span className={props.icons.rotateclockwise!=null?props.icons.rotateclockwise:"glyphicon glyphicon-refresh"} aria-hidden="true"></span>:props.translations.rotateclockwise}</button>:null}
						{props.toolbar.rotateanticlockwise?<button className="btn btn-sm btn-default" onClick={rotateLeft} title={props.renderIcons?props.translations.rotateanticlockwise:""}>{props.renderIcons?<span className={props.icons.rotateanticlockwise!=null?props.icons.rotateanticlockwise:"glyphicon glyphicon-refresh icon-flipped"} aria-hidden="true"></span>:props.translations.rotateanticlockwise}</button>:null}
						{props.toolbar.save?<button className="btn btn-sm btn-default" onClick={onSaveImage} title={props.renderIcons?props.translations.save:""}>{props.renderIcons?<span className={props.icons.save!=null?props.icons.save:"glyphicon glyphicon-floppy-save"} aria-hidden="true"></span>:props.translations.save}</button>:null}
					</div>

				</div>
			</div>
			<div className="container" >
				<div className="crop-container">
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
								<canvas ref={canvasRef} style={{
								}}/>
							</ReactCrop>
						</TransformComponent>
					</TransformWrapper>
				</div>
			</div>
		</div>
	);
}
