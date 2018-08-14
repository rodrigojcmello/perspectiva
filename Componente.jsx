import { render } from 'react-dom';
import './Componente.scss';

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div>
                Teste
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));
