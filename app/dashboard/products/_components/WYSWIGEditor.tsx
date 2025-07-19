import Editor from 'react-simple-wysiwyg';
import "./WYSIWYGEditor.css"
export default function WYSWIGEditor({text,onChange}:{text:string,onChange:any}) {
  

  return (
    <>
    <h4>Markup Description</h4>
    <Editor value={text} onChange={(e)=>{onChange(e.target.value)}}  />
        </>
  );
}