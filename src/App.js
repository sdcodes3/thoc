import { useEffect, useState } from "react";
import Original from "./Original";
import Processed from "./Processed";

function App() {
  const [submit, setSubmit] = useState(false);
  const [selectedOption, setSelectedOption] = useState('nfa');

  const [no_state, setno_state] = useState(4);
  const [states, setstates] = useState("A,B,C,D");
  const [no_alphabets, setno_alphabets] = useState(3);
  const [alphabets, setalphabets] = useState("a,b,c");
  const [start, setstart] = useState("A");
  const [no_final, setno_final] = useState(1);
  const [final, setfinal] = useState("D");
  const [no_transt, setno_transt] = useState(7);
  const [transitions, settransitions] = useState(`A,a,A\nA,e,B\nB,b,B\nA,e,C\nC,c,C\nB,b,D\nC,c,D`);

  const [states1, setstates1] = useState("0,1,2,3,4");
  const [alphabets1, setalphabets1] = useState("a,b");
  const [start1, setstart1] = useState("0");
  const [final1, setfinal1] = useState("3");
  const [transitions1, settransitions1] = useState(`0,a,1\n0,b,0\n1,a,2\n1,b,3\n2,a,2\n2,b,3\n3,a,1\n3,b,4\n4,a,4\n4,b,4`);

  useEffect(() => {
	if(selectedOption === "nfa"){
		localStorage.setItem("port",5000);
	}
	else{
		localStorage.setItem("port",5001);
	}
  },[selectedOption])

  const downloadFile = async () => {
    try {
      const response = await fetch('http://127.0.0.1:'+localStorage.getItem('port')+'/download'); // Make request to Flask API
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'dfa.pdf';

      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleSubmit = async () => {
	let data = {}
	if(selectedOption === "nfa"){
		// nfa tp dfa
		data["no_state"] = no_state;
		data["states"] = states.split(',');
		data["no_alphabets"] = no_alphabets;
		data["alphabets"] = alphabets.split(',');
		data["start"] = start;
		data["no_final"] = no_final;
		data["final"] = final.split(',');
		data["no_transt"] = no_transt;
		data["transitions"] = transitions.split('\n').map(line => line.split(','));

	}
	else{
		data["states"] = states1.split(',');
		data["alphabets"] = alphabets1.split(',');
		data["start"] = start1;
		data["final"] = final1.split(',');
		const result = {};
		
		// Split the input string into lines
		const lines = transitions1.split('\n');
		
		// Iterate over each line
		lines.forEach(line => {
			// Split each line by commas
			const [index, letter, value] = line.split(',');
			result[`('${index}', '${letter}')`] = value;
		});
		data["transitions"] = result;
	}
	try {
		const response = await fetch('http://127.0.0.1:'+localStorage.getItem('port')+'/data', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
	
		const responseData = await response.json();
		console.log('Response:', responseData);
		} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
	setSubmit(true);
  }
  return (
    <div>
      <div className="row g-0">
        {
        submit ? 
          <div className="col row g-0 d-flex gap-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-primary" onClick={() => {
                setSubmit(false);
              }}>Back</button>
              <div>
                <button onClick={downloadFile} className="btn btn-warning" download="dfa.pdf">Download</button>
              </div>
            </div>
            <div className="col border border-2 border-dark">
              <Original />
            </div>
            <div className="col border border-2 border-dark">
              <Processed />
            </div>
            {/* <div>
              Input String to test the DFA :
            </div> */}
          </div>
          :
        <div className="col d-flex flex-column align-items-center">
          <div className="py-3 d-flex flex-column gap-3 col-12 col-md-6 col-xl-4">
            <div className="heading">Enter your data</div>
            <select className="form-select" aria-label="Default select example" value={selectedOption} onChange={(event) => setSelectedOption(event.target.value)}>
              <option value="nfa">NFA / e-NFA to DFA</option>
              <option value="dfa">Minimize DFA</option>
            </select>
			{
				selectedOption === 'nfa'?
				<div className="d-flex flex-column gap-2">
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Number of States : 
						</div>
						<div className="col">
							<input className="form-control" type="number" value={no_state} onChange={(event) => setno_state(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							States (comma seperated) : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={states} onChange={(event) => setstates(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Number of Alphabets : 
						</div>
						<div className="col">
							<input className="form-control" type="number" value={no_alphabets} onChange={(event) => setno_alphabets(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Alphabets (comma seperated) : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={alphabets} onChange={(event) => setalphabets(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Initial State : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={start} onChange={(event) => setstart(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Number of Final States : 
						</div>
						<div className="col">
							<input className="form-control" type="number" value={no_final} onChange={(event) => setno_final(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Final States (comma seperated) : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={final} onChange={(event) => setfinal(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Number of Transitions : 
						</div>
						<div className="col">
							<input className="form-control" type="number" value={no_transt} onChange={(event) => setno_transt(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Transistions (e = epsilon) : 
						</div>
						<div className="col">
							<textarea className="form-control" value={transitions} onChange={(event) => settransitions(event.target.value)} rows={5}>
							</textarea>
						</div>
					</div>
				</div>
				:
				<div className="d-flex flex-column gap-2">
					<div className="row g-0 align-items-center">
						<div className="col-6">
							States (comma seperated) : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={states1} onChange={(event) => setstates1(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Alphabets (comma seperated) : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={alphabets1} onChange={(event) => setalphabets1(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Initial State : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={start1} onChange={(event) => setstart1(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Final States (comma seperated) : 
						</div>
						<div className="col">
							<input className="form-control" type="text" value={final1} onChange={(event) => setfinal1(event.target.value)} />
						</div>
					</div>
					<div className="row g-0 align-items-center">
						<div className="col-6">
							Transistions (e = epsilon) : 
						</div>
						<div className="col">
							<textarea className="form-control" value={transitions1} onChange={(event) => settransitions1(event.target.value)} rows={5}>
							</textarea>
						</div>
					</div>
				</div>
			}
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        }
      </div>
    </div>
  );
}

export default App;
