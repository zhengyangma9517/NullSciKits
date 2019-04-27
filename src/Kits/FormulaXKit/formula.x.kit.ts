import { Models } from '../../models/models';
import { JustTools } from '../JustToolKit/just.tools';

export namespace FormulaX {

    export class Base {
        /**
         * Produce Function Call Back, make input to output
         */
        private _formula: (input: Models.IKeyValue<any>[]) => any;

        /**
         * input Property
         */
        private _input: Models.IKeyValue<any>[] = [];
        get Input(): Models.IKeyValue<any>[] {
            return this._input;
        }
        set Input(input: Models.IKeyValue<any>[]) {
            this._input = input;
        }
        public clearInput() {
            this._input = [];
        }

        /**
         * readonly
         */
        private _output: Models.IKeyValue<any>;
        get Output(): Models.IKeyValue<any> {
            return this._output;
        }
        public clearOnput() {
            this._output = { key: this._name, value: null };
        }

        /**
         * readonly
         */
        private _name: string;
        get Name(): string {
            return this._name;
        }

        public constructor(name: string) {
            this._name = name;
            this._formula = () => { };
            this._output = { key: this._name, value: null };
        }

        public setFormula(formulaCallback: (input: Models.IKeyValue<any>[]) => any) {
            this._formula = formulaCallback;
        }

        public async itsMathTime() {
            try {
                const result = await this._formula(this.Input);
                this._output = { key: this._name, value: result };
            } catch (e) {
                console.log(`Error on FormulaX<${this.Name}> ----------------------------------------------`);
                throw (e);
            }
        }

        public clear() {
            this.clearInput();
            this.clearOnput();
        }
    }

    export function decodePiece(piece: string): IPiece {
        if (JustTools.JustDetective.isMatchRegex(piece, /\(|\[[0-9]*,[0-9]*\)|\]/) ||
            JustTools.JustDetective.isMatchRegex(piece, /\(|\[inf,[0-9]*\)|\]/) ||
            JustTools.JustDetective.isMatchRegex(piece, /\(|\[[0-9]*,inf\)|\]/)
        ) {
            const lower: string = piece.split(',')[0];
            const upper: string = piece.split(',')[1];
            const lowerEq: boolean = lower[0] === '[' ? true : false;
            const upperEq: boolean = upper[upper.length - 1] === ']' ? true : false;
            const lowerVal: number | EInfinity = lower.replace(lower[0], '') === 'inf' ? EInfinity.Inf : Number.parseFloat(lower.replace(lower[0], ''));
            const upperVal: number | EInfinity = upper.replace(upper[upper.length - 1], '') === 'inf' ?
                EInfinity.Inf : Number.parseFloat(upper.replace(upper[upper.length - 1], ''));
            return {
                upper: upperVal,
                lower: lowerVal,
                upperEqual: upperEq,
                lowerEqual: lowerEq
            };
        } else {
            const e: Error = new Error('Invalid Piece Format: ' + piece);
            throw (e);
        }
    }

    export enum EInfinity {
        Inf = 'inf'
    }

    export interface IPiece {
        upper: number | EInfinity;
        lower: number | EInfinity;
        upperEqual: boolean;
        lowerEqual: boolean;
    }
}
