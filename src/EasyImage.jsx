import{useEffect,useState,createElement}from"react";
import EasyCrop from"./components/EasyCrop";
import"./ui/EasyImage.css";
function App(props){
	const[image,setImage]=useState("");
	const[id,setId]=useState("");
	const[imageUrl,setImageUrl]=useState("");
	useEffect(()=>{
		if(props?.image?.status=="available"&&props?.image?.value){
			setImageUrl(props.image.value.uri);
		}
		if(props?.guid?.status=="available"&&props?.guid?.value) {
			setId(props.guid.value);
		}		
	},[props.guid.status,props.image.status]);
	return(
		<div className="App">
			<header className="App-header">
				<EasyCrop onSave={props.onSave} image={imageUrl} id={id}/>
			</header>
		</div>
	);
}
export default App;
