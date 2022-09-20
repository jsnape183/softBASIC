export const Preview = ({ transpiledCode }) => (
  <div style={{ width: "100%", height: "90vh" }}>
    <iframe
      style={{ width: "100%", height: "100%" }}
      sandbox="allow-scripts"
      title="Preview"
      srcDoc={`<html>
      <head>
      
      </head>
      <body>
      <script type="text/javascrip">
      const createArrayDim = (sizes, depth) => {
        if (depth === sizes.length - 1)
          return Array.apply(null, new Array(sizes[depth])).map(() => false);
    
        return Array.apply(null, new Array(sizes[depth])).map(() =>
          Array.apply(null, createArrayDim(sizes, depth + 1))
        );
      };
      const createArray = (sizes) => {
        return createArrayDim(sizes, 0);
      };
      </script>
      <script src="https://pixijs.download/release/pixi.js"></script>
      <script src="../softBasicGfx.js"></script>
      <script type="text/javascript">
      
      ${transpiledCode};
      </script>
      </body>
      </html>`}
    ></iframe>
  </div>
);

export default Preview;
