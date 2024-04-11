from graphviz import Digraph
import ast
from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
class DFA:
    def __init__(self, states, alphabet, transition_function, start_state, accept_states):
        self.states = states
        self.alphabet = alphabet
        self.transition_function = transition_function
        self.start_state = start_state
        self.accept_states = accept_states

    def visualize(self, filename='dfa'):
        dot = Digraph()
        dot.attr(rankdir='LR')

        for state in self.states:
            if state in self.accept_states:
                dot.attr('node', shape='doublecircle')
            else:
                dot.attr('node', shape='circle')
            dot.node(str(state))

        dot.attr('node', shape='none')
        dot.node('')
        dot.edge('', str(self.start_state), label='')

        for (start, symbol), end in self.transition_function.items():
            dot.edge(str(start), str(end), label=symbol)

        dot.render(filename, view=False)

    def minimize(self):
        P = {frozenset(self.accept_states), frozenset(self.states - self.accept_states)}
        W = P.copy()

        while W:
            A = W.pop()
            for c in self.alphabet:
                X = {s for s, d in self.transition_function.items() if d == c and s in A}
                for Y in P.copy():
                    intersection = X & Y
                    difference = Y - X
                    if intersection and difference:
                        P.remove(Y)
                        P.add(frozenset(intersection))
                        P.add(frozenset(difference))
                        if Y in W:
                            W.remove(Y)
                            W.add(frozenset(intersection))
                            W.add(frozenset(difference))
                        else:
                            W.add(frozenset(intersection) if len(intersection) <= len(difference) else frozenset(difference))

        new_states = set()
        new_transitions = {}
        state_name = {}

        for part in P:
            name = min(part)
            new_states.add(name)
            state_name[part] = name
            if name in self.accept_states:
                new_accept_states = {name}
            if name == self.start_state:
                new_start_state = name

        for part in P:
            for state in part:
                for c in self.alphabet:
                    if (state, c) in self.transition_function:
                        target = self.transition_function[(state, c)]
                        target_name = [state_name[p] for p in P if target in p][0]
                        new_transitions[(state_name[part], c)] = target_name

        return DFA(new_states, self.alphabet, new_transitions, new_start_state, new_accept_states)

def minimization(states, alphabet, transition_function, start_state, accept_states):
    states = {0, 1, 2, 3, 4}
    alphabet = {'a', 'b'}
    transition_function = {
        (0, 'a'): 1, (0, 'b'): 0,
        (1, 'a'): 2, (1, 'b'): 3,
        (2, 'a'): 2, (2, 'b'): 3,
        (3, 'a'): 1, (3, 'b'): 4,
        (4, 'a'): 4, (4, 'b'): 4,
    }
    start_state = 0
    accept_states = {3}

    dfa = DFA(states, alphabet, transition_function, start_state, accept_states)
    dfa.visualize('nfa')

    minimized_dfa = dfa.minimize()
    minimized_dfa.visualize('dfa')

# Function to read the content of a file
def read_file_content(filename):
    with open(filename, 'r') as file:
        return file.read()

# Function to send file content as response
def send_file_content(filename):
    content = read_file_content(filename)
    return jsonify({filename: content})

# Route to send the content of the original DFA file
@app.route('/nfa')
def original_dfa():
    minimization({},{},{},0,{})
    return send_file_content('nfa')

# Route to send the content of the minimized DFA file
@app.route('/dfa')
def minimized_dfa():
    return send_file_content('dfa')


@app.route('/download')
def download_file():
    file_path = './dfa.pdf'
    return send_file(file_path, as_attachment=True)

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.json  # Get JSON data from request body
    data["states"] = set(data["states"])
    data["alphabets"] = set(data["alphabets"])
    data["final"] = set(data["final"])
    data["transitions"] = {eval(name): age for name, age in data["transitions"].items()}
    minimization(data["states"],data["alphabets"],data["transitions"],data["start"],data["final"])
    return jsonify({'message': 'DFA Generated...'})


if __name__ == '__main__':
    app.run(host="localhost", port=5001, debug=True)
    # app.run(debug=True)