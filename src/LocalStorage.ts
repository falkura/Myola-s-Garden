import { compress, decompress } from "./Util";

export class LocalStorageClass {
    private storage = window.localStorage;
    private readonly use_compression = false;
    private readonly storage_name = "myola`s garden";
    _data: any;

    getDataById = (value: any) => {
        return this.data[value];
    };

    getId = (): string => {
        function random() {
            return (Math.random() + 1).toString(36).substring(4);
        }

        let id = random();

        while (LocalStorage.getDataById(id)) {
            id = random();
        }

        return id;
    };

    public set data(value: { id: number | string; detail: any }) {
        this._data[value.id] = value.detail;

        let toSave = JSON.stringify(this._data);

        if (this.use_compression) {
            toSave = compress(toSave);
        }

        this.storage.setItem(this.storage_name, toSave);
    }

    public get data(): any {
        let toRestore = this.storage.getItem(this.storage_name) || "{}";

        if (this.use_compression && toRestore !== "{}") {
            toRestore = decompress(toRestore);
        }

        return JSON.parse(toRestore);
    }

    constructor() {
        this._data = this.data;
    }
}

export const LocalStorage = new LocalStorageClass();
