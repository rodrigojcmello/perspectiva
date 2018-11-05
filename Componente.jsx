import {render} from 'react-dom';
// import PerspT from 'perspective-transform';
import './Componente.scss';
import imagem from './imagem.jpeg';
import * as React from "react";
import saveAs from 'file-saver';
import fx from 'glfx';

class App extends React.Component {
    state = {
        srcCorners: [191, 505, 741, 505, 147, 858, 793, 855],
        matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        imagemCortada: null,
        imagemTratada: null
    };
    canvasOriginal = React.createRef();
    ref = {
        imagemCortada: React.createRef(),
    };
    // this.novoCanvas = React.createRef();

    gerarCanvas() {
        this.contextoOriginal = this.canvasOriginal.current.getContext('2d');
        this.img = new Image();
        this.img.src = imagem;
        this.img.onload = () => {
            this.contextoOriginal.drawImage(this.img, 0, 0);
        };
    }

    corrigirPerspectiva = () => {
        // // let dstCorners = [
        // //     0, 0, // superior esquerdo
        // //     646, 0, // superior direito
        // //     0, 353, // inferior esquerdo
        // //     646, 353, // inferior direito
        // // ];
        // // let dstCorners = [
        // //     -43, 0, // superior esquerdo
        // //     646 + (646 - 594), 0, // superior direito
        // //     0, 352, // inferior esquerdo
        // //     646, 353 + (353 - 347), // inferior direito
        // // ];
        // let dstCorners = [
        //     0 - 30, 0 - 30, // superior esquerdo
        //     646, 0, // superior direito
        //     0, 353, // inferior esquerdo
        //     646 + 30, 353 + 30, // inferior direito
        // ];
        // let transform = PerspT(srcCorners, dstCorners);
        // let t = transform.coeffs;
        // t = [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]];
        // this.setState({matrix3d: t});
        let srcCorners = [
            43, 0, // superior esquerdo (X, Y)
            594, 0, // superior direito
            0, 352, // inferior esquerdo
            646, 347, // inferior direito
        ];
        let dstCorners = [
            0, 0, // superior esquerdo
            646, 0, // superior direito
            0, 353, // inferior esquerdo
            646, 353, // inferior direito
        ];
        let canvas = fx.canvas();
        let textura = canvas.texture(this.ref.imagemCortada.current);
        canvas.draw(textura).perspective(srcCorners, dstCorners).update();
        console.log('canvas.toDataURL()', canvas.toDataURL());
        this.setState({imagemTratada: canvas.toDataURL()});
    };

    obterCoordenada = (evento) => {
        let x = evento.nativeEvent.layerX;
        let y = evento.nativeEvent.layerY;
        console.log(x, y);
    };

    cortarImagem = () => {
        console.log('​App -> cortarImagem');
        let canvas = document.createElement('canvas');
        canvas.height = `${858 - 505}`;
        canvas.width = `${793 - 147}`;
        let contexto = canvas.getContext('2d');
        contexto.drawImage(this.img, -147, -505, 960, 1280);
        this.setState({imagemCortada: canvas.toDataURL()});
    };

    baixarImagem = () => {
        // let canvas = this.novoCanvas.current;
        // canvas.toBlob(function (blob) {
        //     saveAs(blob, 'imagem-corrigida.png');
        // });
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
                    <button
                        onClick={this.baixarImagem}
                    >
                        Baixar Imagem
                    </button>
                    <div
                        style={{
                            // transform: `matrix3d(${this.state.matrix3d.join(',')})`,
                            // transform: 'matrix3d(1,0,0,5,0,1,0,0,0,0,1,0,0,0,0,1)',
                            // transform: `matrix3d(${this.state.matrix3d.join(',')})`,
                            border: '3px solid red',
                            fontSize: 0,
                            width: '646px'
                        }}
                    >
                        {
                            this.state.imagemCortada ?
                                <img
                                    src={this.state.imagemCortada}
                                    ref={this.ref.imagemCortada}
                                    alt=''
                                /> :
                                null
                        }
                        {
                            this.state.imagemTratada ?
                                <img
                                    src={this.state.imagemTratada}
                                    alt=''
                                /> :
                                null
                        }
                        {/*<canvas*/}
                        {/*ref={this.novoCanvas}*/}
                        {/*height={858 - 505}*/}
                        {/*width={793 - 147}*/}
                        {/*style={{*/}
                        {/*transform: `matrix3d(${this.state.matrix3d.join(',')})`,*/}
                        {/*}}*/}
                        {/*onMouseDown={this.obterCoordenada}*/}
                        {/*>*/}
                        {/*</canvas>*/}
                    </div>
                </div>
                <canvas
                    className='canvas'
                    ref={this.canvasOriginal}
                    height='1280'
                    width='960'
                    onMouseDown={this.obterCoordenada}
                />
            </>
        );
    }
}

render(<App/>, document.getElementById('app'));
