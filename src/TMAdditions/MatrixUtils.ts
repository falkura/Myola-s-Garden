export function createEmptyMatrix<T>(width: number, height: number): T[][] {
    return Array(width)
        .fill(undefined as unknown as T)
        .map(_a => Array(height).fill(undefined as unknown as T));
}

export function* matrixIterator<T>(matrix: T[][]): IterableIterator<T> {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            yield matrix[x][y];
        }
    }
}

declare global {
    interface Array<T> {
        concatMatrix(source: T[], replace?: boolean): T[];
        subtractMatrix(source: T[]): T[];
        validateMatrixData(name: string, source?: unknown[]): T[] | never;
        isMatrix(): boolean;
        copyMatrix(): T[];
        logMatrix(matrixName?: string, expand?: boolean): T[];
        getMatrixSlise(x: number, y: number, width: number, height: number): T[];
        subtractMatrixByRect(x: number, y: number, width: number, height: number): T[];
        checkMatrixSize(width: number, height: number): boolean;
    }
}

if (!Array.prototype.concatMatrix) {
    Array.prototype.concatMatrix = function <T, K>(this: Array<Array<T | K>>, source: K[][], replace = false): Array<Array<T | K>> {
        this.validateMatrixData("concatMatrix", source || []);

        const target = this.copyMatrix();

        for (let i = 0; i < target.length; i++) {
            for (let j = 0; j < target[i].length; j++) {
                if (replace) {
                    if (source[i][j]) {
                        target[i][j] = source[i][j];
                    }
                } else if (!target[i][j]) {
                    target[i][j] = source[i][j];
                }
            }
        }

        return target;
    };
}

if (!Array.prototype.subtractMatrix) {
    Array.prototype.subtractMatrix = function <T, K>(this: T[][], source: K[][]): T[][] {
        this.validateMatrixData("subtractMatrix", source || []);

        const target = this.copyMatrix();

        for (let i = 0; i < target.length; i++) {
            for (let j = 0; j < target[i].length; j++) {
                if (source[i][j]) target[i][j] = undefined as unknown as T;
            }
        }
        return target;
    };
}

if (!Array.prototype.validateMatrixData) {
    Array.prototype.validateMatrixData = function <T, K>(this: T[][], method: string, source?: K[][]): T[][] {
        if (!this.isMatrix()) throw new Error(`You can use method Array.${method}() only on matrix!`);
        if (source) {
            if (!source.isMatrix()) {
                throw new Error(`You can use method Array.${method}() only with matrix argument!`);
            }

            if (source.length !== this.length || source[0].length !== this[0].length) {
                throw new Error(`You can use method Array.${method}() only with matrix of the same size in the argument!`);
            }
        }

        return this;
    };
}

if (!Array.prototype.isMatrix) {
    Array.prototype.isMatrix = function <T>(this: T[][]): boolean {
        if (!this[0] || !Array.isArray(this[0]) || this[0].length === 0) return false;

        for (const col of this) {
            if (col.length !== this[0].length) return false;
        }

        return true;
    };
}

if (!Array.prototype.copyMatrix) {
    Array.prototype.copyMatrix = function <T>(this: T[][]): T[][] {
        this.validateMatrixData("copyMatrix");

        return this.map(arr => {
            return arr.slice();
        });
    };
}

if (!Array.prototype.subtractMatrixByRect) {
    Array.prototype.subtractMatrixByRect = function <T>(this: T[][], x: number, y: number, width: number, height: number): T[][] {
        this.validateMatrixData("subtractMatrixByRect");

        const target = this.copyMatrix();

        for (let i = 0; i < target.length; i++) {
            for (let j = 0; j < target[i].length; j++) {
                if (j >= x && j < x + width && i >= y && i < y + height) continue;

                target[i][j] = undefined as unknown as T;
            }
        }

        return target;
    };
}

if (!Array.prototype.getMatrixSlise) {
    Array.prototype.getMatrixSlise = function <T>(this: T[][], x: number, y: number, width: number, height: number): T[][] {
        this.validateMatrixData("getSlise");

        return this.copyMatrix()
            .slice(y, y + height)
            .map(row => row.slice(x, x + width));
    };
}

if (!Array.prototype.checkMatrixSize) {
    Array.prototype.checkMatrixSize = function <T>(this: T[][], width: number, height: number): boolean {
        if (!this.isMatrix() || this.length !== width || this[0].length !== height) return false;

        return true;
    };
}

if (!Array.prototype.logMatrix) {
    Array.prototype.logMatrix = function <T>(this: T[][], matrixName?: string, expand = false): T[][] {
        this.validateMatrixData("logMatrix");

        const label: string[] = [`🔹 Matrix Log${matrixName ? ` for %c${matrixName}` : ""} 🔹`];
        const matrixNameStyle = "color:#90ee90;";

        if (matrixName) label.push(matrixNameStyle);

        let res = "";

        this.forEach(row => {
            row.forEach(el => {
                res += el ? "⬜️" : "⬛️";
            });
            res += "\n";
        });

        if (expand) {
            console.group(...label);
        } else {
            console.groupCollapsed(...label);
        }

        console.log(res);
        console.groupCollapsed("%cSource 👇 ", "color:#FFF9A6;");
        console.log(this);
        console.groupEnd();
        console.groupEnd();

        return this;
    };
}
