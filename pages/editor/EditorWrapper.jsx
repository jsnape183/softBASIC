import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import lexer from "../../lib/compiler/lexer";
import parser from "../../lib/compiler/parser";
import transpiler from "../../lib/compiler/transpiler";
import defs from "../../lib/defs";
const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });
const Preview = dynamic(() => import("../../components/Preview"), {
  ssr: false
});
const EditableText = dynamic(() => import("../../components/EditableText"), {
  ssr: false
});

export const EditorWrapper = ({ id }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  let updateTicker = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const [transpiledCode, setTranspiledCode] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`../api/projects/${id}`);
      const data = await res.json();
      console.log("Fetching");
      setProject(data.data);
    };
    if (id && !project) {
      fetchProject();
    }
  }, [id, project]);

  useEffect(() => {
    const saveProject = () => {
      const doSave = async () => {
        const lastSaved = new Date() - project.lastSaved;
        if (isNaN(lastSaved) || lastSaved > 5000 || project.dirty) {
          console.log(project);
          setProject({ ...project, dirty: false, lastSaved: new Date() });
          await fetch(`../api/projects/${id}`, {
            method: "POST",
            body: JSON.stringify({
              name: project?.name ?? "Untitled Project",
              files: project.files
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          });
        }
      };
      if (project) {
        doSave();
      }
    };
    saveProject();
  }, [id, updateTicker, project]);

  const handlePlayClick = () => {
    try {
      //console.log(project);
      const lexResult = lexer.lex({ ...project, defs });
      //console.log(lexResult);
      const parseResult = parser.parse(lexResult);
      //sconsole.log(parseResult);
      const transpilerResult = transpiler.transpile(
        parseResult.tree,
        parseResult.symbolTable
      );
      console.log(transpilerResult);
      setError(null);
      setTranspiledCode(transpilerResult);
      setShowPreview(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const handleStopClick = () => setShowPreview(false);
  //eval(transpilerResult);
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "spaced-evenly"
        }}
      >
        <div style={{ flexGrow: 1 }}>&nbsp;</div>
        <div style={{ flexGrow: 2, textAlign: "center" }}>
          <EditableText
            defaultText={project?.name ?? "Untitled Project"}
            onChange={(v) => setProject({ ...project, name: v, dirty: true })}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          {!showPreview && <button onClick={handlePlayClick}>Play</button>}
          {showPreview && <button onClick={handleStopClick}>Stop</button>}
        </div>
      </div>
      {!showPreview && project && (
        <div style={{ width: "100%" }}>
          <Editor
            source={project.files[0].source}
            height={showPreview ? "0vh" : "90vh"}
            onChange={(v) =>
              setProject({
                ...project,
                files: [{ name: "main.bas", source: v }]
              })
            }
            error={error}
          />
        </div>
      )}
      {showPreview && (
        <div style={{ width: "100%" }}>
          <Preview transpiledCode={transpiledCode} />
        </div>
      )}
    </div>
  );
};

export default EditorWrapper;
