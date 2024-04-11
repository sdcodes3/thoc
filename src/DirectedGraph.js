import React, { useRef, useEffect } from 'react';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

const DirectedGraph = ({ graphData }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    const viz = new Viz({ Module, render });
    viz.renderSVGElement(graphData)
      .then((element) => {
        graphRef.current.appendChild(element);
      })
      .catch((error) => {
        console.log(graphData);
        console.error('Error rendering graph:', error);
      });
  }, [graphData]);

  return (
    <div ref={graphRef}></div>
  );
};

export default DirectedGraph;
