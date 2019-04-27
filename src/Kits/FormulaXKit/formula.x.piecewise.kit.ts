import { FormulaX } from './formula.x.kit';
import { Models } from '../../models/models';
import { EFormulas } from './formulas.enumerate';
import { JustDetective } from 'justtools';

export namespace PieceWise {

    export interface IPieceFunction {
        func: (x: number) => any;
        piece: FormulaX.IPiece;
    }

    export class Formula extends FormulaX.Base {

        private _pieces: IPieceFunction[] = [];
        get Pieces(): IPieceFunction[] {
            return this._pieces;
        }
        set Pieces(pieces: IPieceFunction[]) {
            this._pieces = pieces;
        }

        private _isDiscrete: boolean;
        get IsDiscrete(): boolean {
            return this._isDiscrete;
        }
        set IsDiscrete(bool: boolean) {
            this._isDiscrete = bool;
        }

        public addPiece(piece: string, func: (x: number) => any) {
            try {
                const decoded = FormulaX.decodePiece(piece);
                this._pieces.push(
                    {
                        func: func,
                        piece: decoded
                    }
                );
            } catch (e) {
                throw e;
            }
        }

        /**
         *
         * @param id
         * @param isDiscrete
         */
        public constructor(id: string, isDiscrete: boolean) {
            super(`${EFormulas.PieceWise}<${id}>`);
            this._isDiscrete = isDiscrete;
            let formula: any = () => { };
            if (!isDiscrete) { } else {
                formula = async (
                    input: Models.IKeyValue<any>[]
                ): Promise<number> => {
                    const x = input[0].value;
                    if (JustDetective.simpleDetect(x)) {
                        let sum: number = 0;
                        let grandPiece: IPieceFunction | null = null;
                        this.Pieces.map((pieceF: IPieceFunction) => {
                            if (pieceF.piece.upper === FormulaX.EInfinity.Inf && pieceF.piece.lower === FormulaX.EInfinity.Inf) {
                                grandPiece = pieceF;
                            } else if (pieceF.piece.upper === FormulaX.EInfinity.Inf) {
                                if (pieceF.piece.lowerEqual ? x >= pieceF.piece.lower : x > pieceF.piece.lower) {
                                    grandPiece = pieceF;
                                }
                            } else if (pieceF.piece.lower === FormulaX.EInfinity.Inf) {
                                if (pieceF.piece.upperEqual ? x <= pieceF.piece.upper : x < pieceF.piece.upper) {
                                    grandPiece = pieceF;
                                }
                            } else {
                                const isHit: boolean = (pieceF.piece.lowerEqual ? x >= pieceF.piece.lower : x > pieceF.piece.lower)
                                    && (pieceF.piece.upperEqual ? x <= pieceF.piece.upper : x < pieceF.piece.upper);
                                if (isHit) {
                                    grandPiece = pieceF;
                                }
                            }
                        });
                        if (grandPiece!.piece.upper === FormulaX.EInfinity.Inf && grandPiece!.piece.lower === FormulaX.EInfinity.Inf) {
                            sum += grandPiece!.func(x);
                        } else {
                            for (let i = 0; i < this.Pieces.indexOf(grandPiece!); i++) {
                                if (typeof this.Pieces[i].piece.upper === 'number' && typeof this.Pieces[i].piece.lower === 'number') {
                                    sum += this.Pieces[i].func(
                                        Number.parseFloat(this.Pieces[i].piece.upper.toString())
                                        - Number.parseFloat(this.Pieces[i].piece.lower.toString())
                                    );
                                } else if (this.Pieces[i].piece.lower === FormulaX.EInfinity.Inf) {
                                    sum += this.Pieces[i].func(
                                        Number.parseFloat(this.Pieces[i].piece.upper.toString())
                                        - 0
                                    );
                                }
                            }
                            sum += grandPiece!.piece.lower === FormulaX.EInfinity.Inf ? grandPiece!.func(
                                x
                                - 0
                            ) : grandPiece!.func(
                                x - Number.parseFloat(grandPiece!.piece.lower.toString())
                            );
                        }
                        return sum;
                    }
                    return 0;
                };
            }
            this.setFormula(formula);
        }
    }
}
