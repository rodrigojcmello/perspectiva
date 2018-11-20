import {render} from 'react-dom';
import s from './Componente.scss';
import imagem from './imagem2.jpeg';
import * as React from "react";
// import saveAs from 'file-saver';
import fx from 'glfx';
import update from "immutability-helper";

class App extends React.Component {
    state = {
        srcCorners: [],
        matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        imagemCortada: null,
        imagemTratada: null,
        marcadores: [],
        altura: 600,
        largura: 850
    };
    imagemOriginal = React.createRef();
    canvasFinal = React.createRef();

    gerarCanvasFinal() {
        this.contextoFinal = this.canvasFinal.current.getContext('2d');
        this.img = new Image();
        this.img.src = this.state.imagemTratada;
        this.img.onload = () => {
            this.contextoFinal.drawImage(this.img, 0, 0);
        };
    }

    corrigirPerspectiva = () => {
        let dstCorners = [
            0, 0, // superior esquerdo
            this.state.largura, 0, // superior direito
            0, this.state.altura, // inferior esquerdo
            this.state.largura, this.state.altura, // inferior direito
        ];
        let canvas = fx.canvas();
        let textura = canvas.texture(this.imagemOriginal.current);
        canvas.draw(textura).perspective(this.state.srcCorners, dstCorners).update();
        console.log('canvas.toDataURL()', canvas.toDataURL());
        this.setState({imagemTratada: canvas.toDataURL()});
    };

    obterCoordenada = (evento) => {
        let x = evento.nativeEvent.layerX;
        let y = evento.nativeEvent.layerY;
        this.setState(update(this.state, {
            marcadores: {
                $push: [{
                    left: `${x}px`,
                    top: `${y}px`
                }]
            },
            srcCorners: {
                $push: [x, y]
            }
        }));
        console.log(x, y);
    };

    // cortarImagem = () => {
    //     console.log('​App -> cortarImagem');
    //     let canvas = document.createElement('canvas');
    //     canvas.height = `${858 - 505}`;
    //     canvas.width = `${793 - 147}`;
    //     let contexto = canvas.getContext('2d');
    //     contexto.drawImage(this.img, -147, -505, 960, 1280);
    //     this.setState({imagemCortada: canvas.toDataURL()});
    // };
    //
    // baixarImagem = () => {
    //     // let canvas = this.novoCanvas.current;
    //     // canvas.toBlob(function (blob) {
    //     //     saveAs(blob, 'imagem-corrigida.png');
    //     // });
    // };

    removerMarcacao = (evento) => {
        let indice = Number(evento.target.dataset.indice);
        this.setState(update(this.state, {
            marcadores: {
                $unset: [indice]
            }
        }));
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.imagemTratada !== this.state.imagemTratada) {
            this.gerarCanvasFinal();
        }
    }

    render() {
        console.log('this.state', this.state);
        console.log('matrix3d', this.state.matrix3d.join(','));
        return (
            <>
                <div>
                    <button
                        onClick={this.corrigirPerspectiva}
                    >
                        Corrigir perspectiva
                    </button>
                    {/*<button*/}
                    {/*onClick={this.baixarImagem}*/}
                    {/*>*/}
                    {/*Baixar Imagem*/}
                    {/*</button>*/}
                    <div
                        style={{
                            border: '3px solid red',
                            fontSize: 0,
                            width: `${this.state.largura}px`
                        }}
                    >
                        {
                            this.state.imagemTratada &&
                            <canvas
                                ref={this.canvasFinal}
                                height={`${this.state.altura}px`}
                                width={`${this.state.largura}px`}
                            />
                        }
                    </div>
                </div>
                <div className={s.canvas_original}>
                    <img
                        ref={this.imagemOriginal}
                        height='1280'
                        width='960'
                        src={imagem}
                        onMouseDown={this.obterCoordenada}
                    />
                    {this.state.marcadores.map((marc, i) => (
                        <span
                            key={i}
                            className={s.marcador}
                            style={marc}
                            data-indice={i}
                            onClick={this.removerMarcacao}
                        />
                    ))}
                </div>
            </>
        );
    }
}

render(<App/>, document.getElementById('app'));
