import { render } from 'react-dom';
// import PerspT from 'perspective-transform';
import './Componente.scss';
import imagem from './imagem.jpeg';

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            srcCorners: [191, 505, 741, 505, 147, 858, 793, 855]
        };
        this.canvas = createRef();
        this.novoCanvas = createRef();
    }
    gerarCanvas() {
        this.contexto = this.canvas.current.getContext('2d');
        this.img = new Image();
        this.img.src = imagem;
        this.img.onload = () => {
            this.contexto.drawImage(this.img, 0, 0);
        };
    }
    obterCoordenada = (evento) => {
        let x = evento.nativeEvent.layerX;
        let y = evento.nativeEvent.layerY;
        console.log(x, y);
    }
    cortarImagem = () => {
        console.log('​App -> cortarImagem');
        this.contexto2 = this.novoCanvas.current.getContext('2d');
        this.contexto2.drawImage(this.img, -147, -505, 960, 1280);
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
                <button
                    onClick={this.cortarImagem}
                >
                    Cortar Imagem
                </button>
                <canvas
                    ref={this.novoCanvas}
                    height={858 - 505}
                    width={793 - 147}
                >
                </canvas>
                <canvas
                    className='canvas'
                    ref={this.canvas}
                    height='1280'
                    width='960'
                    onMouseDown={this.obterCoordenada}
                >
                </canvas>
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));
