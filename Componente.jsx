import { render } from 'react-dom';
// import PerspT from 'perspective-transform';
import './Componente.scss';
import imagem from './imagem.jpeg';

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.canvas = createRef();
    }
    gerarCanvas() {
        this.contexto = this.canvas.current.getContext('2d');
        var img = new Image();
        img.src = imagem;
        img.onload = () => {
            this.contexto.drawImage(img, 0, 0);
        };
    }
    componentDidMount() {
        this.gerarCanvas();
        // let srcCorners = [158, 64, 494, 69, 495, 404, 158, 404];
        // let dstCorners = [100, 500, 152, 564, 148, 604, 100, 560];
        // let perspT = PerspT(srcCorners, dstCorners);
        // let srcPt = [250, 120];
        // let dstPt = perspT.transform(srcPt[0], srcPt[1]);
        // console.log('​App -> componentDidMount -> dstPt', dstPt);
    }
    render() {
        return (
            <div>
                <canvas
                    ref={this.canvas}
                    height='1280'
                    width='960'
                >
                </canvas>
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));
