import React, { useState, useEffect } from 'react';
import DirectedGraph from './DirectedGraph';
import './loader.css'

function Processed(){
    const [data, setData] = useState(null);

    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:'+localStorage.getItem('port')+'/dfa'); // Make request to Flask API
            const jsonData = await response.json();
            setData(jsonData["dfa"]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return(
        <div className='d-flex align-items-center flex-column gap-5 p-3'>
            <div className='heading'>Output Finite Automata</div>
            <div className='d-flex justify-content-center align-items-center'>
                {data ? (
                    <DirectedGraph graphData={data} />
                ) : (
                    <div>
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Processed;