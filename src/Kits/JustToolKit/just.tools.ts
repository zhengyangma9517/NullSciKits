import * as moment from 'moment';
const base64 = require('base-64');

export namespace JustTools {
    export enum justOperator {
        Greater = '>',
        Greaterequal = '>=',
        Less = '<',
        Lessequal = '<=',
        Equal = '='
    }

    /**
     * Answer Status enum : "failed" indicates the function called isn't working or invalid input
     */
    export enum AnswerStatus {
        Success = 'success',
        Failed = 'failed'
    }

    /**
     * Answer format { status: AnswerStatus, detail: string }
    */
    export interface IAnswer {
        status: AnswerStatus;
        detail: string;
    }

    /**
     * @description Unknow type detective, 未知类型侦探 2.1
     */
    export class JustDetective { // 未知类型侦探

        constructor() {
        }

        /**
         * 未知类型探测器
         * @param toCheckData 待检查数据
         * @param toOpFunction 处理数据的函数
         * @param signal 出错位置 /producerpath/valuename
         */
        public static detect = (toCheckData: any, toOpFunction: any, signal?: string | null) => { // 未知类型探测器
            if (toCheckData !== undefined && toCheckData !== {} && toCheckData !== null && toCheckData !== '') {
                toOpFunction(toCheckData);
            } else {
                if (signal !== null && signal !== undefined) {
                    console.error('Unknown type value : ' + signal);
                }
            }
        }
        /**
         *
         * @param str
         * @param reg
         */
        public static isMatchRegex = (str: string, reg: any) => {
            const pattern = new RegExp(reg);
            return pattern.exec(str) ? true : false;
        }
        /**
         * Simplified Unknown value detective
         * @param toCheckData
         */
        public static simpleDetect(toCheckData: any): boolean {
            return toCheckData !== undefined && toCheckData !== {} && toCheckData !== null && toCheckData !== '' ? true : false;
        }

        /**
         * @param toReplace 待替换字段
         * @param replacer 被替换字段
         * @param signal 出错位置 /producerpath/valuename
         * @description 未知类型替代器（指定字段）
         */
        public static nullReplace = (toReplace: any, replacer: any, signal?: string | null) => {
            if (toReplace !== undefined && toReplace !== {} && toReplace !== null && toReplace !== '') {
                return toReplace;
            } else {
                if (signal !== null) {
                    console.error('Unknown type value : ' + signal);
                }
                return replacer;
            }
        }

        /**
         * @param obj 解读对象
         * @description 递归解读器, 将对象包括其子对象、数组、属性中全部的未知类型转换成null值, 或者去除。目前版本为去除
         */
        public static recursionDecipher = (obj: any) => { // 递归解读器, 将对象包括其子对象、数组、属性中全部的未知类型转换成null值, 或者去除。目前版本为去除
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                // console.log(obj[keys[i]]);
                if (obj[keys[i]] instanceof Array) {
                    obj[keys[i]].map((v: any) => {
                        JustDetective.recursionDecipher(v);
                    });
                } else if (obj[keys[i]] === '' || obj[keys[i]] === [] || obj[keys[i]] === undefined || obj[keys[i]] == null || typeof obj[keys[i]].then === 'function') {
                    // obj[keys[i]] = null;
                    delete (obj[keys[i]]);
                    // console.log(obj[keys[i]] + typeof obj[keys[i]]);
                } else if (typeof obj[keys[i]] === 'object' && obj[keys[i]] !== null) {
                    JustDetective.recursionDecipher(obj[keys[i]]);
                }
            }
        }

    }

    /**
     * @description a tool to convert string to string array values
     */
    export class JustConcatter { //

        private inputType = 'any';
        private outputType = 'string[]';

        /**
         * @param toConcat 被拼接字符串
         * @param splitter 字符串分隔符
         * @description 智慧型拼装器，a tool to convert string to string array values
         */
        public smartConcat = (toConcat: any, splitter: string): string[] => {
            let strArr: any = [];
            if (typeof toConcat === 'string') {
                strArr = strArr.concat(toConcat.split(splitter));
            }
            return strArr;
        }

    }

    /**
     * @description a tool to convert obj into special forms
     */
    export class JustObjManager { // a tool to convert obj into special forms

        /**
         * @param toConvert 被转换对象，
         * @description 将对象转换成对象['key：内容']的字符串数组形式
         */
        public justObjConvert = (toConvert: any) => { // obj -> ['key: content']
            let strArr: any = [];
            strArr = Object.keys(toConvert).map((key) => {
                return (toConvert[key] ? `${key} : ${toConvert[key]}` : '');
            });
            return strArr.filter((str: any) => str !== '');
        }

    }

    /**
     * @description Not just mathmatic fomulas, this is a super tool for sundry algrithm from scratch
     */
    export class JustMathGenius {

        /**
         * edit distance calculation , greater more similar
         * @param str1 compariable 1
         * @param str2 compariable 2
         */
        public editDistance(str1: string, str2: string): number {
            const l1 = str1.length;
            const l2 = str2.length;
            const superMatrix: any[] = [];
            // init levenshtein matrix 初始化 乐文斯坦矩阵 >w<
            for (let i = 0; i < l2 + 1; i++) {
                superMatrix[i] = [];
                for (let j = 0; j < l1 + 1; j++) {
                    if (i === 0) {
                        superMatrix[i][j] = j;
                    } else if (j === 0) {
                        superMatrix[i][j] = i;
                    } else {
                        superMatrix[i][j] = 0;
                    }
                }
            }
            // distance calculation
            let temp = 0;
            for (let i = 1; i < l2 + 1; i++) {
                for (let j = 1; j < l1 + 1; j++) {
                    if (str2[i - 1] === str1[j - 1]) {
                        temp = 0;
                    } else { temp = 1; }
                    const compariables: Array<number> = [superMatrix[i - 1][j] + 1, superMatrix[i][j - 1] + 1, superMatrix[i - 1][j - 1] + temp];
                    const min = Math.min(...compariables);
                    superMatrix[i][j] = min;
                }
            }
            const comparison = 1 - superMatrix[l2][l1] / Math.max(l1, l2);
            return Math.round(comparison * 10000) / 10000;
        }

        /**
         * similarity of 2 numbers calculation, greater more similar
         * @param number1
         * @param number2
         */
        public numberDeviation(number1: number, number2: number): number {
            if (number1 === 0) {
                return 0;
            }
            return (Math.round((1 - Math.abs((number1 - number2) / number1)) * 1000) / 1000);
        }

        /**
         * coord distance sphere { lat: number, lng: number}
         * unit: meters
         * @param coords
         */
        public coordDistance(coords: any[]) {
            const earthR = 6371;
            const degreesToRadians = (degrees: number) => { return (degrees * Math.PI / 180); };
            const degreesLat = degreesToRadians(coords[1].lat - coords[0].lat);
            const degreesLon = degreesToRadians(coords[1].lng - coords[0].lng);
            const lat1 = degreesToRadians(coords[0].lat);
            const lat2 = degreesToRadians(coords[1].lat);
            const a = Math.pow(Math.sin(degreesLat / 2), 2) + Math.pow(Math.sin(degreesLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return Math.round(earthR * c * 1000 * 100) / 100;
        }

        /**
         * if the number is in the range
         * @param num to hit number
         * @param range *-* format range
         */
        public isHitRange(num: number, range: string) {
            const pattern = new RegExp(/[0-9]*-[0-9]*/);
            if (pattern.exec(range)) {
                const lower = Number(range.split('-')[0]);
                const upper = Number(range.split('-')[1]);
                return num >= lower && num <= upper ? true : false;
            } else {
                const answer: IAnswer = { status: AnswerStatus.Failed, detail: 'Incorrect range format.' };
                return (answer);
            }
        }

        /**
         * timestamp converter
         * @param dt timstamp format date ( xxxx-xxxx ) version
         */
        public timestampConvert(timst: string) {
            if (JustDetective.simpleDetect(timst) && JustDetective.isMatchRegex(timst, /([a-zA-Z0-9]*-[a-zA-Z0-9]*)/)) {
                let dt = timst.split('(')[1].split(')')[0].split('-')[0];
                dt = moment(Number(dt)).format() || '';
                return dt || null;
            } else {
                const answer: IAnswer = { status: AnswerStatus.Failed, detail: 'Bad input or incorrect format' };
                return (answer);
            }
        }

        /**
         * linear Regression function
         * @param condition > < >= <= =
         * @param y dependent
         * @param x independent
         * @param linearFuntion
         */
        public linearReg(condition: justOperator, y: number, x: number, linearFuntion = (thisx: number) => { const thisy = thisx; return thisy; }): boolean {
            switch (condition) {
                case justOperator.Equal: {
                    return linearFuntion(x) === y ? true : false;
                }
                case justOperator.Greater: {
                    return linearFuntion(x) > y ? true : false;
                }
                case justOperator.Greaterequal: {
                    return linearFuntion(x) >= y ? true : false;
                }
                case justOperator.Less: {
                    return linearFuntion(x) < y ? true : false;
                }
                case justOperator.Lessequal: {
                    return linearFuntion(x) <= y ? true : false;
                }
            }
        }
    }

    export class JustSpy { // safe guard
        constructor() {
        }

        /**
         * base64 encoder
         * @param str
         * @param salt
         * @param numOfSalt number of Salt
         */
        public static base64Encoder(str: string, salt: string, numOfSalt: number) {
            if (!(str.length > 0)) {
                return '';
            }
            const strArray = [];
            for (let i = 0; i < str.length; i++) {
                strArray.push(str[i]);
            }
            const numberofSalt = Math.floor(Math.random() * numOfSalt) + 1;
            for (let j = 0; j < numberofSalt; j++) {
                const splitter = Math.floor(Math.random() * strArray.length);
                strArray[splitter] = `${salt}${strArray[splitter]}`;
            }
            return base64.encode(strArray.join(''));
        }
    }
}
