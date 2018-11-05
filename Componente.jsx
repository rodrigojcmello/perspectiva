import {render} from 'react-dom';
import PerspT from 'perspective-transform';
import './Componente.scss';
import imagem from './imagem.jpeg';
import * as React from "react";

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            srcCorners: [191, 505, 741, 505, 147, 858, 793, 855],
            matrix3d: []
        };
        this.canvas = React.createRef();
        this.novoCanvas = React.createRef();
    }

    gerarCanvas() {
        this.contexto = this.canvas.current.getContext('2d');
        this.img = new Image();
        this.img.src = imagem;
        this.img.onload = () => {
            this.contexto.drawImage(this.img, 0, 0);
        };

    }

    corrigirPerspectiva = () => {
        let srcCorners = [191, 505, 741, 505, 147, 858, 793, 855];
        let dstCorners = [147, 505, 793, 505, 147, 858, 793, 858];
        let transform = PerspT(srcCorners, dstCorners);
        let t = transform.coeffsInv;
        t = [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]];
        this.setState({matrix3d: t});
    };

    obterCoordenada = (evento) => {
        let x = evento.nativeEvent.layerX;
        let y = evento.nativeEvent.layerY;
        console.log(x, y);
    };

    cortarImagem = () => {
        console.log('​App -> cortarImagem');
        this.contexto2 = this.novoCanvas.current.getContext('2d');
        this.contexto2.drawImage(this.img, -147, -505, 960, 1280);
    };

    componentDidMount() {
        this.gerarCanvas();
    }

    render() {
        console.log('this.state', this.state);
        console.log('matrix3d', this.state.matrix3d.join(','));
        return (
            <>
                <div>
                    <button
                        onClick={this.cortarImagem}
                    >
                        Cortar Imagem
                    </button>
                    <button
                        onClick={this.corrigirPerspectiva}
                    >
                        Corrigir perspectiva
                    </button>
                    <div
                        style={{
                            // transform: `matrix3d(${this.state.matrix3d.join(',')})`,
                            // transform: 'matrix3d(1,0,0,5,0,1,0,0,0,0,1,0,0,0,0,1)',
                            border: '3px solid red',
                            fontSize: 0,
                            width: '646px'
                        }}
                    >
                        <canvas
                            ref={this.novoCanvas}
                            height={858 - 505}
                            width={793 - 147}
                            style={{
                                transform: `matrix3d(${this.state.matrix3d.join(',')})`,
                            }}
                        >
                        </canvas>
                    </div>
                </div>
                <canvas
                    className='canvas'
                    ref={this.canvas}
                    height='1280'
                    width='960'
                    onMouseDown={this.obterCoordenada}
                />
            </>
        );
    }
}

render(<App/>, document.getElementById('app'));
