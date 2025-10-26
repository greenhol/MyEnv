export class ModuleConfig<T> {
    data: T;
    private _initialConfig: T;
    private _storageKey: string;
    private _storageType: "local" | "session";

    constructor(
        initialConfig: T,
        storageKey: string,
        saveOnExit: boolean = true,
        storageType: "local" | "session" = "local",
    ) {
        this._initialConfig = initialConfig;
        this._storageKey = storageKey;
        this._storageType = storageType;

        if (!this.load()) {
            this.data = { ...this._initialConfig };
        }
        this.init(saveOnExit);
    }

    private init(saveOnExit: boolean) {
        // @ts-ignore
        if (window.configControl == null) {
            // @ts-ignore
            window.configControl = [];
        }
        // @ts-ignore
        if (window.config == null) {
            // @ts-ignore
            window.config = [];
        }

        // @ts-ignore
        window.configControl[this._storageKey] = this;
        // @ts-ignore
        window.config[this._storageKey] = this.data;

        if (saveOnExit) {
            window.addEventListener("beforeunload", () => {
                this.save();
            });
        }
    }

    save(): void {
        const storageObject = this._storageType === "local" ? localStorage : sessionStorage;
        storageObject.setItem(this._storageKey, JSON.stringify(this.data));
        console.log(`Configuration ${this._storageKey} saved to ${this._storageType}`);
    }

    load(): boolean {
        const storageObject = this._storageType === "local" ? localStorage : sessionStorage;
        const data = storageObject.getItem(this._storageKey);
        if (data) {
            try {
                this.data = JSON.parse(data);
                console.log(`Configuration ${this._storageKey} loaded from ${this._storageType}`);
                return true;
            } catch (e) {
                console.error("Error loading configuration ${this._storageKey}:", e);
                return false;
            }
        } else {
            console.log(`No Configuration ${this._storageKey} found in ${this._storageType}`);
            return false;
        }
    }

    clear(): void {
        const storageObject = this._storageType === "local" ? localStorage : sessionStorage;
        storageObject.removeItem(this._storageKey);
        console.log(`Configuration ${this._storageKey} cleared from ${this._storageType}`);
    }

    print(): void {
        console.log("Current configuration ${this._storageKey}:", this.data);
    }

    reset(): void {
        this.data = { ...this._initialConfig };
        console.log(`Configuration ${this._storageKey} reset ${JSON.stringify(this.data)}`);
    }
}
