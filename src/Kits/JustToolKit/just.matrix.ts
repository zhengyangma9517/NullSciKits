export namespace JustMatrix {
    /**
 * make format more clear and easy to print
 * @param str
 * @param strLenght
 */
    export function prettySpaces(str: string, strLenght = 15) {
        if (str.length < strLenght) {
            const diff = strLenght - str.length;
            const front = Math.round(diff / 2);
            const rear = diff % 2 === 0 ? Math.round(diff / 2) : Math.round(diff / 2 + 1);
            const result = [];
            for (let i = 0; i < front; i++) {
                result.push(' ');
            }
            result.push(str);
            for (let i = 0; i < rear; i++) {
                result.push(' ');
            }
            return String(result.join(''));
        }
    }

    /**
     * pretty print for matrix
     * @param matrix
     */
    export function prettyMatrixPrint(matrix: any[]) {
        matrix.map((row) => {
            console.log(row.join(''));
            console.log('\r\n');
        });
    }
}
